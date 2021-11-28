package com.example.uploadingfiles.Utilites;

import java.io.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class Utilities {

    private static final Logger LOGGER = LoggerFactory.getLogger(Utilities.class);

    public static String FileProcessing (String fileName){
     
        String s = null;

        try {
            // using the Runtime exec method:
            Process p = Runtime.getRuntime().exec("python3 ./VirusDetection/VirusDetection.py " + fileName);
            
            BufferedReader stdInput = new BufferedReader(new 
                 InputStreamReader(p.getInputStream()));

            BufferedReader stdError = new BufferedReader(new 
                 InputStreamReader(p.getErrorStream()));

            String finalString = "";
            // read the output from the command
            System.out.println("Here is the standard output of the command:\n");
            while ((s = stdInput.readLine()) != null) {
                finalString+=s;
            }

            if(!finalString.isEmpty()){
                return finalString;
            }
            LOGGER.info(finalString);

            String errorString = "";
            // read any errors from the attempted command
            System.out.println("Here is the standard error of the command (if any):\n");
            while ((s = stdError.readLine()) != null) {
                errorString+=s;
            }

            LOGGER.info(errorString);
            return "ANALYSIS_FAILED";
        }
        catch (Exception e) {
            System.out.println("exception happened - here's what I know: ");
            e.printStackTrace();
            return "ANALYSIS_FAILED";
        }
    }

}