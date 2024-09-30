<h1 align="center">
<a href="https://devpost.com/software/cascade-xrfscu">Cascade</a>
</h1>

<p align="center">An elegant, functional CSS trainer.</p>

## Inspiration
When your CSS gets rusty, you don’t want to have to start a new project to get back in shape. You want to review **key syntax elements** and recover your muscle memory as frictionlessly as possible.

## What it does
Cascade provides a sleek, efficient interface for practicing CSS. It displays a series of intelligently-rendered styled component similar to ones you might see in real development, and your job is to recreate them as quickly as possible.

## How we built it
The backend, deployed on Heroku, uses Flask and MongoDB. It stores a history of puzzles per session and generates images for each puzzle from raw HTML/CSS. The ruleset generation is handled by a Breadboard project that leverages Gemini-based agents.

The grading system uses a Siamese neural network trained in the Intel Tiber Developer Cloud. It jointly utilizes two pretrained VGG16 CNNs and some final comparison layers manually trained using the Intel Max Series GPU on 4th Gen Intel Xeon processors. It is hosted in an ITDC instance running the same hardware, and deployed using ngrok.

The frontend is built on Next.js, which provides a robust interface for the application. 

## Challenges we ran into
We had to make our own buildpack for Heroku, so deploying and installing binaries for the project was particularly difficult. An inherent challenge of our project was implementing a live preview of HTML without introducing security issues - we identified the proper dependencies to do so. 

## Accomplishments that we're proud of
Our process of generating training data for the Siamese neural network, as well as training it, is highly optimized for time and space efficiency. We generated over a gigabyte of training data within minutes, and by freezing key layers in the network, we managed to reduce training time over tenfold without sacrificing performance.

## What's next for Cascade
More validation, testing, and expansion to multiple users.