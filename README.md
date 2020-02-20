# Merchant service

The merchant service - a service to sell the license token - was implemented as a Node.js application written in JavaScript with React.js and bootstrap front end. As a Blockchain client, Infura API with Web3.js library was used.
Merchant service uses the approach of not gathering any data about the buyers - service can distribute tokens without any knowledge of the client. This approach fully complies with the GDPR.

Merchant service displays a list of books allowed by the creator to be distributed. The service allows a customer to buy the tokens using a user's build in the browser Ethereum wallet that injects Web3. The most popular on the market, browser wallet, is MetaMask, which in this case, was used. 

The merchant service and redirects the buyer to the delivery services. On clicking the buy button, the MetaMask window appears and asks the user to confirm the transaction. As soon as the buyer confirms the transaction, the token is purchased, and third parties are compensated. The buyer can review the owned tokens in their MetaMask wallet.

## Demo

https://www.youtube.com/watch?v=B4-gsvnvECI

# Run

```shell
cd client
docker build -t merchant-service .
docker run -d -p 3000:3000 merchant-service
```

or

```shell
cd client
npm run dev
```
