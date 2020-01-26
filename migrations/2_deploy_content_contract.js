const DappToken = artifacts.require("DappToken.sol");

const DigitalContentContract = artifacts.require(
  "./DigitalContentContract.sol"
);
const ContentContractFactory = artifacts.require(
  "./ContentContractFactory.sol"
);

module.exports = async function(deployer, network, accounts) {
  const _name = "Romeo and Juliet by William Shakespeare";
  const _symbol = "RJWS";
  const _decimals = 0;
  ROMEO_AND_JULIET_HASH_SHA256 =
    "C63A0215532664843CD2C7F7F05AD1C54ECD499AF055668F0C8352AC67A15CDA";

  const _name2 = "Hamlet by William Shakespeare";
  const _symbol2 = "HWS";
  const _decimals2 = 0;
  HAMLET_HASH_SHA256 =
    "33F63D2C1FCE59B60FE10682F98CA30B72BC06DC54D2EBDE8DCF3D9CF0C2B16B";

  const [owner, ...otherAccounts] = accounts;

  const creatorCompensation = web3.utils.toHex(
    web3.utils.toWei("0.5", "ether")
  ); // wei 1e5
  const currentPrice = web3.utils.toHex(web3.utils.toWei("1", "ether")); // wei 1e6
  const merchant = accounts[1];

  const deliverer = accounts[2];
  const delivererCompensation = web3.utils.toHex(
    web3.utils.toWei("0.1", "ether")
  ); // wei 1e5
  const keyAuthority = accounts[3];
  const keyAuthorityCompensation = web3.utils.toHex(
    web3.utils.toWei("0.1", "ether")
  ); // wei 1e5

  // Deploy Romeo & Julia
  await deployer.deploy(ContentContractFactory, _name, _symbol, _decimals, {
    from: owner
  });
  const romeoFactory = await ContentContractFactory.deployed();
  console.log(`REACT_APP_ROMEO_FACTORY = ${romeoFactory.address}`);
  console.log(`REACT_APP_ROMEO_TOKEN = ${await romeoFactory.tokenAddress()}`);

  await romeoFactory.deployContentContract(
    merchant,
    ROMEO_AND_JULIET_HASH_SHA256,
    creatorCompensation,
    currentPrice,
    {
      from: owner
    }
  );

  const contractAddressArrayRomeo = await romeoFactory.getContractsByAddress();

  const romeoContract = await DigitalContentContract.at(
    contractAddressArrayRomeo[0]
  );
  console.log(`REACT_APP_ROMEO_CONTRACT = ${romeoContract.address}`);

  await romeoContract.setDeliverer(deliverer, {
    from: merchant
  });
  await romeoContract.setDelivererCompensation(delivererCompensation, {
    from: merchant
  });
  await romeoContract.setKeyAuthority(keyAuthority, {
    from: merchant
  });
  await romeoContract.setKACompensation(keyAuthorityCompensation, {
    from: merchant
  });

  // Deploy Hamlet

  await deployer.deploy(ContentContractFactory, _name2, _symbol2, _decimals2, {
    from: owner
  });
  const hamletFactory = await ContentContractFactory.deployed();

  console.log(`REACT_APP_HAMLET_FACTORY = ${hamletFactory.address}`);
  console.log(`REACT_APP_HAMLET_TOKEN = ${await hamletFactory.tokenAddress()}`);

  await hamletFactory.deployContentContract(
    merchant,
    HAMLET_HASH_SHA256,
    creatorCompensation,
    currentPrice,
    {
      from: owner
    }
  );

  const contractAddressArrayHamlet = await hamletFactory.getContractsByAddress();

  const hametContract = await DigitalContentContract.at(
    contractAddressArrayHamlet[0]
  );

  await hametContract.setDeliverer(deliverer, {
    from: merchant
  });
  await hametContract.setDelivererCompensation(delivererCompensation, {
    from: merchant
  });
  await hametContract.setKeyAuthority(keyAuthority, {
    from: merchant
  });
  await hametContract.setKACompensation(keyAuthorityCompensation, {
    from: merchant
  });

  console.log(`REACT_APP_HAMLET_CONTRACT = ${hametContract.address}`);
};
