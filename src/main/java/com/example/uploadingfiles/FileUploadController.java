package com.example.uploadingfiles;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import com.example.uploadingfiles.storage.StorageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.uploadingfiles.storage.StorageFileNotFoundException;
import com.example.uploadingfiles.storage.StorageService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin
@Controller
public class FileUploadController {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileUploadController.class);
	private final StorageService storageService;
	private final FileAnalyzerService fileAnalyzerService;
	private final FileRepository fileRepository;

    @Autowired
	public FileUploadController(StorageService storageService, FileAnalyzerService fileAnalyzerService, FileRepository fileRepository) {
		this.storageService = storageService;
		this.fileAnalyzerService = fileAnalyzerService;
		this.fileRepository = fileRepository;
	}

	@GetMapping("/loadfiles")
	@ResponseBody
	public Iterable<File> listUploadedFiles() throws IOException {
		return fileRepository.find20Files();
	}

	@GetMapping("/files/{fileName}")
	@ResponseBody
	public File getFile(@PathVariable String fileName) {
		Iterable<File>  fileList = fileRepository.findAll();

		Iterator<File> fileIterator = fileList.iterator();
		while(fileIterator.hasNext()){
			File file = fileIterator.next();
			if(file.getFile_name().equals(fileName)){
				return file;
			}
		}
		return null;
	}


	@PostMapping("/files")
	@ResponseBody
	public Message handleFileUpload(@RequestParam("file") MultipartFile file) {
		Message msg = new Message();
		try{
			if(getFile(file.getOriginalFilename()) == null){
				storageService.store(file);
				fileAnalyzerService.analyzeFileAndUpdateDataBase(file.getOriginalFilename(),fileRepository,storageService);
				msg.setMessage("OK");
			}
			else{
				msg.setMessage("FILE EXISTS");
			}
		}catch (StorageException e) {
			msg.setMessage("FAILED");
		}
		return msg;
	}


	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}

}