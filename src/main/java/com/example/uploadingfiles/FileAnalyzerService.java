package com.example.uploadingfiles;

import com.example.uploadingfiles.Utilites.Utilities;
import com.example.uploadingfiles.storage.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;

@Service
public class FileAnalyzerService {


    public FileAnalyzerService() {

    }

    @Async
    public void analyzeFileAndUpdateDataBase(String fileName, FileRepository fileRepository, StorageService storageService){
        String result = Utilities.FileProcessing(fileName);
        storageService.delete(fileName);
        File file = new File();
        file.setFile_name(fileName);
        if(result.equals("MALWARE")){
            file.setFile_result(Status.MALWARE);
        }
        else if(result.equals("BENGIN")){
            file.setFile_result(Status.BENGIN);
        }else{
            file.setFile_result(Status.ANALYSIS_FAILED);
        }
        try{
            fileRepository.save(file);
        }catch (Exception e){
            System.out.println(e);
        }
    }
}
