pragma solidity ^0.5.0;

import "../client/node_modules/@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "../client/node_modules/@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract DappToken is ERC20Mintable, ERC20Detailed {
    constructor(string memory _name, string memory _symbol, uint8 _decimals)
        public
        ERC20Detailed(_name, _symbol, _decimals){}
}

// Deploy
// truffle(development)> DappToken.deployed().then((t) => { token = t })
// ContentContractFactory.deployed().then((t) => { factory = t })
// Address
// truffle(development)> token.address

// Name and symbol
// token.name()
// token.symbol()