
from setuptools import setup, find_packages
setup(
    name='VirusDetection',
    version='0.1.0',
    packages=find_packages(include=['VirusDetection', 'VirusDetection.*']),
    install_requires=[
        'hmms',
        'pandas',
        'sklearn'
    ]
)