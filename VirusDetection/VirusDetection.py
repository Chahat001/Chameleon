from VirusDetectionUtilites import convert_file_to_seq
import logging
import os
import sys
import hmms
import pickle
import numpy as np
from sklearn import preprocessing
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler


def detect_virus(fileName: str):
    """
        This is the main function called by the command line. It will call all the sub functions, and prints the result to command line
        fileName (str) : Name of the file to be scanned inside the 
    """
    logging.basicConfig(handlers=[logging.FileHandler(filename="./log_records.txt", 
                                                 encoding='utf-8', mode='a+')],
                    format="%(asctime)s %(name)s:%(levelname)s:%(message)s", 
                    datefmt="%F %A %T", 
                    level=logging.ERROR)
    seq_l = convert_file_to_seq(fileName=fileName)
    if(os.path.exists("VirusDetection/MachineLearningModels/hmm_paramter.npz")):
        logging.info("Reading Trained HMM model from the hmm_paramter.npz file")
        # retrieve alerady trained HMM model 
        hmm = hmms.DtHMM.from_file("VirusDetection/MachineLearningModels/hmm_paramter.npz")
    else:
        logging.error("Cannot find hmm_parameter.npz file")
        print("NULL")
        return
    
    if(os.path.exists("VirusDetection/MachineLearningModels/TrainedKnnModelPickleFile")):
        logging.info("Reading Trained KNN model from the TrainedKnnModelPickleFile file")
        model = pickle.load(open('VirusDetection/MachineLearningModels/TrainedKnnModelPickleFile', 'rb'))
    else:
        logging.error("Cannot find TrainedKnnModelPickleFilefile ")
        print("NULL")
        return
    
    hmm_prob = hmm.emission_estimate(np.array(seq_l))
    if(hmm_prob == -float('inf')):
        hmm_prob = 0
    
    result = model.predict([[hmm_prob]])
    if result == 1:
        print("MALWARE")
    else:
        print("BENGIN")

detect_virus(sys.argv[1])
