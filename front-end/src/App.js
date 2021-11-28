import React from "react";
import axios from "axios";
import { Table } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
// import LoadingOverlay from "react-loading-overlay";
// import FadeLoader from "react-spinners/FadeLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.css';

class App extends React.Component {
  state = {
    files: null,
    results: [
{file_id: 1, file_name: "file1.exe", file_result: "Malware"},
{file_id: 2, file_name: "file2.exe", file_result: "Benign"},
{file_id: 3, file_name: "file3.exe", file_result: "Malware"},
{file_id: 4, file_name: "file4.exe", file_result: "Benign"},
{file_id: 5, file_name: "file5.exe", file_result: "Malware"},
{file_id: 6, file_name: "file6.exe", file_result: "Malware"},
{file_id: 7, file_name: "file7.exe", file_result: "Malware"},
],
    loading: true,
      search: false,
  };


    handleSearch = () => {
        var filename = document.getElementById("searchText").value;
        if (filename !== "" && filename != null) {
            this.setState({ search: true });


            // CHAHAT REPLACE URL WITH THE CORRECT API NAME
            axios({
                // Endpoint to search terms
                url: "http://localhost:8080/files/" + filename,
                method: "GET",
            })
                // backend response to POST handled here
                // Server response format: 1 result {file_id: "", file_name: "", file_result: "", message: "OK" or "NO"}

                .then((res) => {
                    if ((res.data != null)) {
                        var tempResults = [];
                        tempResults.push({
                            file_id: res.data.file_id,
                            file_name: res.data.file_name,
                            file_result: res.data.file_result,
                        });
                        this.setState({ results: tempResults });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    endSearch = () => {
        this.setState({ search: false });
        console.log(this.state.search);
        this.getFilesAfterEndSearch();
    };

    getFilesAfterEndSearch() {
        axios({
            // Endpoint to request files
            url: "http://localhost:8080/loadfiles",
            method: "GET",
        })
            // backend response to GET handled here
            // Server response format: [{file_id: "", file_name: "", file_result: ""}]
            .then((res) => {
                console.log("Incoming Data ", res.data)
                var fileList = this.state.results.filter(x => {return x.file_result === "Analyzing"})
                var fileBeingAnalyzed =  []
                console.log("fileList => ", fileList)
                for(var i = 0; i < fileList.length; i++){
                    var fileAnalyzed = res.data.filter(x => {return x.file_name === fileList[i].file_name})
                    console.log("fileAnalyzed => ", fileAnalyzed)
                    if(fileAnalyzed.length === 0){
                        fileBeingAnalyzed.push(fileList[i])
                    }
                }

                console.log("fileBeingAnalyzed afterloop:", fileBeingAnalyzed)
                this.setState({results: fileBeingAnalyzed.concat(res.data), loading: true});
            })
            .catch((err) => {
                console.log(err);
            });
    }


    handleFile(e) {
    // Getting the files from the input
    let files = e.target.files;
    this.setState({ files });
  }
  
  handleUpload(e) {
    let files = this.state.files;
  
    let formData = new FormData();
  
    //Adding files to the formdata
    formData.append("file", files[0]);
    console.log(files[0]);


    // Display file name here
    var a = formData.get("file");
    console.log(a);
  
    axios({
      // Endpoint to send files
      url: "http://localhost:8080/files",
      method: "POST",
      data: formData,
    })
	// backend response to POST handled here
	// Server response format: {file_id: "", file_name: "", file_result: "Currently analyzing", message: "OK" or "NO"}
      .then((res) => {

		if(res.data.message == "OK") {
            alert("File  Uploaded !!")
            const tempResults = [];
            tempResults.push({file_id: 1111 , file_name: formData.get("file").name, file_result: "Analyzing"});
			this.setState({ results: tempResults.concat(this.state.results)});
            document.getElementById("fileupload").value = ""
		}
        else if(res.data.message == "FAILED"){
            alert("File upload falled !!")
        }
        else if(res.data.message == "FILE EXISTS"){
            alert("File alerady exits in database, Try Searching!!")
        }
	})
      .catch((err) => {
		console.log(err);
	 });
  }

  componentDidMount() {
    
	console.log("About to request results from the server");


	setInterval(() => {

		console.log("Fires every minute");
        var search = this.state.search;

    if(search === false){
        axios({
            // Endpoint to request files
            url: "http://localhost:8080/loadfiles",
            method: "GET",
        })
            // backend response to GET handled here
            // Server response format: [{file_id: "", file_name: "", file_result: ""}]
            .then((res) => {
                if(search === false){
                    console.log("Incoming Data ", res.data)
                    var fileList = this.state.results.filter(x => {return x.file_result === "Analyzing"})
                    var fileBeingAnalyzed =  []
                    console.log("fileList => ", fileList)
                    for(var i = 0; i < fileList.length; i++){
                        var fileAnalyzed = res.data.filter(x => {return x.file_name === fileList[i].file_name})
                        console.log("fileAnalyzed => ", fileAnalyzed)
                        if(fileAnalyzed.length === 0){
                            fileBeingAnalyzed.push(fileList[i])
                        }
                    }

                    console.log("fileBeingAnalyzed afterloop:", fileBeingAnalyzed)
                    this.setState({results: fileBeingAnalyzed.concat(res.data), loading: true});
                }
            })
            .catch((err) => { console.log(err)});
    }


      }, 10000);

  }
  
  render() {

    if (this.state.loading === false) 
	 return (
        <React.Fragment>
	<p style = {{color: "white"}}>Content loading</p>
        </React.Fragment>
      );

    return (
      <div>

<Navbar bg="dark" variant="dark" fixed="top">
    <Container>
        <img src="Logo.png" alt="Logo" height="100px"/>
        <Navbar.Brand href="#table"><h2><b>Chameleon Malware Detector</b></h2></Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="#table">Past file results</Nav.Link>
      <Nav.Link href="#upload">Upload file for analysis</Nav.Link>
      <Nav.Link href="#further">Further information</Nav.Link>
    </Nav>
    </Container>
  </Navbar>


	<div id = "table" class = "cont">

        <div id = "search">
            <br />
            <br />
            <br />
            <br />
            <input
                type="text"
                placeholder="Enter file name to search"
                id="searchText"
                style={{ height: "30px", width: "30%" }}
            />
            <button onClick={this.handleSearch}>Search server for file </button>

            {this.state.search === true && (
                <React.Fragment>
                    <br />
                    <br />
                    <button onClick={this.endSearch}>Return to main results</button>
                </React.Fragment>
            )}
        </div>
        
	<br/><br/>
	<div class = "contheader">
	<h5><b>Results for previously analyzed files</b></h5></div>
	<br/>

<Table striped bordered variant="dark">
<thead>
    <tr>
      <th>File ID</th>
      <th>File Name</th>
      <th>File Result</th>
    </tr>
</thead>
<tbody>
{this.state.results.map ( result => {
	return <tr key = {result}>
	      <td>{result.file_id}</td>
	      <td>{result.file_name}</td>
	      <td>{result.file_result}</td>
	</tr>	
})}
</tbody>
</Table><br/>

	<div id = "upload" class = "upload">

        <h5><b>Upload your file for malware analysis</b></h5>
	<br/>

	<div>
        <input
            id="fileupload"
          type="file"
          onChange={(e) => this.handleFile(e)}
        />
        <button onClick={(e) => this.handleUpload(e)}
        >Send file to server for analysis</button>

	</div>

	<small style = {{color: "yellow"}}>Note: Files cannot be larger than 5 MB.</small></div>
</div>

<Navbar bg="dark" variant="dark">
    <Container>
    <Navbar.Brand href="#table">Chameleon malware detector</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="#bla">Terms and conditions</Nav.Link>
      <Nav.Link href="#bla1">Privacy Policy</Nav.Link>
    </Nav>
    </Container>
  </Navbar>


      </div>
    );
  }
}

export default App;
