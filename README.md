# Classification of Retinal Damage from OCT Scan images
# Inception:

   To classify Retinal Damage from OCT scans using VGG16 PreTrained model.
      
     Transfer learning turns out to be useful when dealing with relatively small dataset; for examples medical images, which are harder to obtain in large numbers than other dataset. Instead of training a deep neural network from scratch, which would require a significant amount of data, power and time, it's often convenient to use a pre-trained model and just fine-tune its performance to simplify and speed up the process. Retinal optical coherence tomography (OCT) is an imaging technique used to capture high-resolution cross sections of the retinas of living patients.  A complete dataset containing the OCT scan images of three diseases namely CNV, DME and DRUSEN, and a bunch of NORMAL scan images are used to train the system. The dataset is divided into three categories: training, validation and test. The first one will be, obviously, used for training; the validation set will be used to measure the model performance during training and the test set of images will be classified based on the trained model. The VGG-16 is able to classify 1000 different labels. Here, we have only 4 categories.

     The first phase is to upload the PreTrained Model. During the training phase, the model will be fine tuned. It can be saved to local disk using PyTorch. Whenever we need to classify an OCT, the model can be loaded onto memory and the testing phase is run.

    For a training dataset of 0.25M images in all 4 categories (1M overall), it is recommended to train the model for at least 20 epochs. The lesser the dataset, the lesser the number of epochs proportionally.

    Given the model is trained perfectly without any over-fitting or under-fitting, it is capable of providing an accuracy of 95%. 

PreTrained Models used : vgg16_bn.pth
Libraries used : PyTorch with CUDA support.

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
2. Download the script.ipynb file
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