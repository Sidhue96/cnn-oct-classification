# Intall and run :
1. Make sure that GPU is enabled in your system.
===============================================
You can check this by:
    Open a python shell:
        >> import torch
        >> use_gpu = torch.cuda.is_available()
        >> if use_gpu:
        >>     print("Using CUDA")
================================================
2. Download the ipynb file
3. Open it in Jupyter Notebook
    Follow the instructions here to install and open jupyter notebook: http://jupyter.org/install
#
4. Download the pre trained model : The model is private.
5. Download the weight : The weight is private.
#
6. 1. To test:
    Replace the path to the given test images with your test images
    Load the weight model by replacing the path to the original weight file
    Run test
#
6. 2. To train:
    Choose the amount of data you want to train the system with. By default it is half dataset.
    Run train
