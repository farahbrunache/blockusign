# blockusign

A decentralized document signing tool where you own and control your own documents, contracts and data.

It is built on BlockStack.

![alt text](https://github.com/ntheile/blockusign/blob/master/blockusign.png?raw=true "Block-U-Sign")

# To Run Locally

The app uses Ionic (Angular + Cordova + Material Design UI) make sure you have it installed https://ionicframework.com/docs/intro/installation/ 

`cd BlockUSign.Ionic`

`npm install`

There are several ways to start the app.  Sometimes when logging in with blockstack you come across cors issues. Most apps use a Node proxy, but then livereload does not work. That is why I created a few npm scripts to help.


If you goto the package.json file look at the scripts sections and look for `"start"`

For mac, the script should read :

 `"start": "npm run chrome-mac && ionic serve"`

For windows: change the script to this (take off the -mac):

`"start": "npm run chrome && ionic serve"`

To actually start the app run:

`npm run start`

You will most likely get this error:

`Cannot GET /signup.html`

This only happens the first time you open the app. Sorry, I have not had time to improve this part yet :( . To fix this,  you will need to open the developer tools and set a localStorage setting in the console
or else you will be redirected to a non-existent signup.html page.

`localStorage.setItem('signUp', 'true')`

Refresh the app back to the root and you should be prompted for blockstack login!

`http://localhost:8100/`

If you are having login issues due to CORS, you can run the app the first time with a node proxy. This will boot up the app as a node app. * note you cannot live reload while debugging, so I recommend only using this when logging in for the first time.s

`npm run serve`



# Architecture Diagram

TODO :) 



Blockusign Tokenomics (Work/Idea in Progress)
====================

Inspiration article
https://medium.com/public-market/the-future-of-network-effects-tokenization-and-the-end-of-extraction-a0f895639ffb

1. Use the app for free for X months or for X number of documents signed.
2. By the time you sign over X documents to keep using the platform you must buy 1 Blockusign (Tokenomics !?!?)
3. Early adopter will be insentivised to use the app more, sign more docs, and tell thier friends about it, because they basically own a part of the Blockusign network now. (Network Effects !?!?) 

Users get a free product for typical use cases (for example signing 5 documents a week). More advanced users will need to buy a token to keep using the tool after X amounts of docuemts signed.  Therefore after buying a token you have stake in the network which will unlock them to sign X more documents. When they have a vested interest in using a great product it will fund the developers to continouly iterate and create a better product. The more tokens a user aquires the better the product will become for them.

Total Supply Distrubitions
==========================
Continuous Developmnet = 25%
User (mining Rewards, Networks Effect) = 75%


# Proof of Signing Mining
X nummber of docs signed per day will mine out X amount of tokens.

# Scare Resources
- Humans using the app and signing docs
- developers time and knowledge contributing code

# Prevent Spam
- we don't want one user signing a million docs in one day spamming the network [unless they own alot of tokens]

Alternate Funding Models
========================
- Monthly subscriptions
- Pay per sign
- Free with pay for advanced features
