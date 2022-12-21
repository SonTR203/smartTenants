# Smart Tenant Documentation

<!-- PROJECT LOGO -->
<p align="center">
  <h3 align="center">Algonquin College Data Analytics Centre</h3>

  <p align="center">
    <br />
    <a href="https://drive.google.com/drive/folders/1jT5QRN7ePdPOhqojMYwYHIY1I8dzb37L?usp=sharing"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://youtu.be/C53szQaV7Dg">View Demo</a>
    ·
    <a href="https://github.com/Team-4-InteliDev-Solutions/smartTenants/issues">Report Bug</a>
    ·
    <a href="https://forms.gle/kQrU3V1w5uybbEL19">Request Feature</a>
    ·
    <a href="https://drive.google.com/drive/folders/1jT5QRN7ePdPOhqojMYwYHIY1I8dzb37L?usp=sharing">APP Docs</a>
   
  </p>
</p>


## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Details](#technical-details)
- [User Research](#user-research)
- [Product Research](#product-research)
- [Personas](#personas)
- [Usage Scenarios](#usage-scenarios)
- [Information Architecture](#information-architecture)
- [Paper Prototype](#paper-prototype-and-wireframes)
- [Wireframes](#paper-prototype-and-wireframes)
- [Visual Design](#visual-design)
- [Usability Testing Documents](#usability-testing-documentation)
- [Interactive Visual MockUp](#interactive-visual-mockup)
- [Usability Test Results](#usability-test-results)
- [High-Level Architecture](#high-level-architecture)
- [Technical Research](#technical-research)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running the App](#running-the-app-on-ios-simulator)
- [Contact](#contact)

## Overview

### Smart Tenant App

A mobile app for a property management company in Ottawa to engage in better and continuous communication with their tenants while allowing them to stay in touch with their community, get rewards, and much more.

### Administrative Portal

A web portal designed to give administrators the ability to oversee the app and communication with its users through means of notices or announcements.

## Key Features

### Smart Tenant App

- Post, like, and comment on a Newsfeed
- Buy or sell items on a Marketplace
- View and interact with notifications
- Access to resident portal
- Messaging for the Marketplace

### Administrative portal

- Approve or deny new users
- Moderate potentially inappropriate posts
- Delete user profiles
- Update user information

## Technical Details

### Built with

- Node JS
- React Native
- Firebase

### Developed using

- VS Code (IDE)
- Xcode
- Android Studio
- Expo

## User Research

[User Research](https://docs.google.com/spreadsheets/d/12Ib9RQPLNKbEPzJYYDii5ptsx94XhZ8DW3rsHYUEAiw/edit?usp=sharing)

- Resarch data from interviews with potential users.

## Product Research

[Product Research](https://docs.google.com/document/d/1z_7dcd5tzjuniCsOqrAngQjg38-wBn0TIEbjrMQyxrU/edit?usp=sharing)

- Research about the market, our competitors, and brand.

## Personas

[Personas](https://drive.google.com/file/d/1eiSTnHX9DgnkK7twdlQNOwr5iieu1F8N/view?usp=sharing)

- Five personas. Two for admin and three for primary user (tenants).

## Usage Scenarios

[Usage Scenarios](https://drive.google.com/file/d/1XVkQmBgYXagPbxe7tD4WQS7dQZnjkV-z/view?usp=sharing)

- Four Scenarios. Two for admin and two for primary user (tenants).

## Information Architecture

[Information Architecture](https://drive.google.com/file/d/1iEI6CSO5jyOysaq7qXjF-PGWs-i1ivn6/view?usp=sharing)

- Information Architecture that lays out the structure of Smart Tenant.

## Paper Prototype and Wireframes

[Paper Prototype & Wireframes](https://www.figma.com/file/kFgphXFidovr14ZwLZw0Wh/PaperPrototype?node-id=29%3A1295)

## Visual Design

[Visual Design](https://www.figma.com/file/5QLXkPmlKUZTiloi6MrJAe/SmartLiving---WireFrame?node-id=418%3A406)

## Interactive Visual MockUp

- Click link or scan QR with mobile device.

[Primary User (Tenant)](https://tinyurl.com/5n79wphj)

[Secondary User (Admin)](https://tinyurl.com/2p8dkvwm)

## Usability Testing Documentation

[Usability Testing Documentation](https://drive.google.com/drive/folders/1MjHp9-wDElr3ci8TIA3tL1reyf44mXCo?usp=sharing)

- Usability Testing Documentation folder contains 'Test Plan' and 'Test Script'

## Usability Test Results

[Usability Test Results](https://docs.google.com/document/d/1qA-VlqQeSptt_xRMxhHI3tWfYN0wk6qN7ocuzyQDvXQ/edit?usp=sharing)

- Information about the participants and findings.

## High-Level Architecture

[High-Level Architecture](https://drive.google.com/file/d/1RNfFgXIHckAG0j6LPGXXb6UrTz87PmyD/view?usp=sharing)

The high-level architecture ☝️, is a diagram that indicates which components we used to build the application and the format of the data being passed between them. On the front end, we have 2 different user facing UI components: Admin and Tenant. These communicate with the Firebase backend depending on the role of the user.

Admins have access to everything the tenants do with the addition of the Admin Panel and being able to delete any post.

External resources will link to 3rd party URLs and APIs.

## Technical Research

[Technical Research Document](https://docs.google.com/document/d/10oSp3rgkv1LKX3CilwgDttDU9E_3aN66/edit?usp=sharing&ouid=107570230041613540173&rtpof=true&sd=true)

This document includes information and how-to guides about the technologies that are used to build the application. You may refer to the following repos for proof of concept samples.

- [Proof of concept for Newsfeed](https://github.com/Team-4-InteliDev-Solutions/proofOfConceptNewsfeed)
- [Proof of concept for image uploads](https://github.com/Team-4-InteliDev-Solutions/image-upload-proof-of-concept)
- [Proof of concept for authentication](https://github.com/Team-4-InteliDev-Solutions/proofOfConceptAuthentication)
- [Proof of concept for theming](https://github.com/Team-4-InteliDev-Solutions/ThemeProofOfConcept)

## Getting Started

The following instructions will walk you through setting up the project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

1. Install yarn on your computer through the [npm package manager](https://www.npmjs.com/)

- Or update yarn

```sh
npm install --global yarn
```

2. Install expo-cli on your computer -- we recommend at least version 5.2.0 https://docs.expo.dev/get-started/installation/

- Or from terminal

```sh
yarn add expo-cli
```

#### Running the App on iOS Simulator

3. Create a new folder and open it in the Terminal

4) Use the command `git clone -b dev https://github.com/Team-4-InteliDev-Solutions/smartTenants.git` to clone the Development repo into your new folder

5) Change your directory to ‘smartTenants’ by using the command `cd smartTenants`

6) Install the node modules by using the command `yarn`

7) After the node modules have finished installing, run the command `expo start --ios` to start an iPhone simulator. note: You will need to have expo installed, and have a simulated device configured

You should now be able to interact with our app on your simulated device! Enjoy!

## Contact

Project Supervisor: [Adesh Shah](https://www.linkedin.com/in/shahadesh/)

Project Lead: [Evan Liko](https://www.linkedin.com/in/evan-liko/)

Developer/Designer: [Son Tran](https://www.linkedin.com/in/son-tran-5aa65122b/)

Developer/Designer: [Kesnia Chornokondratenko](https://www.linkedin.com/in/kseniia-ch/)

Developer/Designer: [Tibet Akyurekli](https://www.linkedin.com/in/tibety/)

Developer/Designer: [Minh Hoang Tran](https://www.linkedin.com/in/tran0450/)
