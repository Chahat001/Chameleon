import os
import subprocess
from os import listdir
import csv
from pandas import np
from sklearn import preprocessing
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import sys

def convert_file_to_seq(fileName: str)-> list:
    files = []
    count = 0

    path = os.path.abspath("uploads")
    commands = "mov lea xchg lods pop push call ret leave hlt int add sub div mul inc dec or and xor shr shl test cmp jo jno js jns je jz jne jnz jb jnae jc jnb jae jnc jbe jna ja jnbe jl jnge jge jnl jle jng jg jnle jp jpe jnp jpo jcxz jecxz jmp loop nop"

    commands = commands.split(" ")

    types = dict()
    types[1] = "mov lea xchg lods pop push".split(" ")  # data processing opcodes
    types[2] = "call ret leave hlt int".split(" ")  # process instructions opcod
    types[3] = "add sub div mul inc dec".split(" ")  # arithmatics instructions
    types[4] = "or and xor shr shl test".split(" ")  # Logic flow instructions
    types[
        5] = "cmp jo jno js jns je jz jne jnz jb jnae jc jnb jae jnc jbe jna ja jnbe jl jnge jge jnl jle jng jg jnle jp jpe jnp jpo jcxz jecxz jmp loop nop".split(
        " ")  # control flow instructions
    #
    # with open('data_beng.csv', 'w+', newline='') as csvfile:
    #     spamwriter = csv.writer(csvfile, delimiter=' ',
    #                             quotechar='|', quoting=csv.QUOTE_MINIMAL)


    total_inst_count = [0] * 5
    # read content of the file into string
    cmd = "objdump -d " + str(path) + "/" + fileName
    shell = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    subprocess_return = shell.stdout.read()
    ans = ""
    for each in subprocess_return:
        ans += chr(each)
    # extrract machine instructions from the input string
    all_inst = []
    for inst in ans.splitlines():
        for s_len in range(2,5):
            for start in range(0,len(inst)):
                if start+s_len <= len(inst):
                    sub_str = inst[start:start+s_len]
                    if sub_str in commands:
                        all_inst.append(sub_str)


    # get count of each category
    for inst in all_inst:
        for i in range(1, 6):
            if inst in types[i]:
                total_inst_count[i - 1] += 1

    # convert instruction count into sequence
    prob_l = [0] * 5
    for col in range(len(total_inst_count)):
        prob_l[col] = str(total_inst_count[col] / sum(total_inst_count)) + " " + str(col)

    prob_l.sort(key=lambda x: x.split(" ")[0], reverse=True)

    for prob in range(len(total_inst_count)):
        prob_l[prob] = int(prob_l[prob].split(" ")[1])

    return prob_l
