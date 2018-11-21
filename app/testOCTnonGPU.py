from __future__ import print_function, division
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
from torch.autograd import Variable
import numpy as np
import torchvision
from torchvision import datasets, models, transforms
import matplotlib.pyplot as plt
import time
import os
import copy
import sys
TEST = 'test-image'
data_transforms = {
    TEST: transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
    ])
}
image_datasets = {
    x: datasets.ImageFolder(
        x, 
        transform=data_transforms[x]
    )
    for x in [TEST]
}
dataloaders = {
    x: torch.utils.data.DataLoader(
        image_datasets[x], batch_size=8,
        shuffle=True, num_workers=4
    )
    for x in [TEST]
}
class_names = ['CNV','DME','DRUSEN','NORMAL']
def visualize_model(vgg, num_images=6):
    was_training = vgg.training
    vgg.train(False)
    vgg.eval() 
    images_so_far = 0
    title = []
    for i, data in enumerate(dataloaders[TEST]):
        inputs, labels = data
        size = inputs.size()[0]
        inputs, labels = Variable(inputs, requires_grad=True), Variable(labels, requires_grad=True)
        outputs = vgg(inputs)
        _, preds = torch.max(outputs.data, 1)
        predicted_labels = [preds[j] for j in range(inputs.size()[0])]
        title = [class_names[x] for x in predicted_labels]
        del inputs, labels, outputs, preds, predicted_labels
        torch.cuda.empty_cache()
        images_so_far += size
        if images_so_far >= num_images:
            break
    print(title[0])
    vgg.train(mode=was_training)
def eval_model(vgg, criterion):
    test_batches = len(dataloaders[TEST])
    for i, data in enumerate(dataloaders[TEST]):
        vgg.train(False)
        vgg.eval()
        inputs, labels = data
        inputs, labels = Variable(inputs, requires_grad=True), Variable(labels, requires_grad=True)
        outputs = vgg(inputs)
        _, preds = torch.max(outputs.data, 1)
        del inputs, labels, outputs, preds
        torch.cuda.empty_cache()
vgg16 = models.vgg16_bn()
vgg16.load_state_dict(torch.load("vgg16_bn.pth"))
for param in vgg16.features.parameters():
    param.require_grad = False
num_features = vgg16.classifier[6].in_features
features = list(vgg16.classifier.children())[:-1]
features.extend([nn.Linear(num_features, len(class_names))])
vgg16.classifier = nn.Sequential(*features)
criterion = nn.CrossEntropyLoss()
optimizer_ft = optim.SGD(vgg16.parameters(), lr=0.001, momentum=0.9)
exp_lr_scheduler = lr_scheduler.StepLR(optimizer_ft, step_size=7, gamma=0.1)
vgg16.load_state_dict(torch.load('VGG16_v2-OCT_Retina_half_dataset.pt', map_location={'cuda:0': 'cpu'}))
eval_model(vgg16, criterion)
visualize_model(vgg16, num_images=1)