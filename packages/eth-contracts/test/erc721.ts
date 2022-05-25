import { expect } from 'chai';
import { ethers } from 'hardhat';
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from '@iobridge/constants';
import { BigNumber } from 'ethers';

describe('ShadowERC721', function () {
  it('Should update role after re-grant/renounce', async function () {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com/', alice.address, bob.address);
    await shadow.deployed();

    expect(await shadow.MINTER_ROLE()).to.equal(MINTER_ROLE);
    expect(await shadow.DEFAULT_ADMIN_ROLE()).to.equal(DEFAULT_ADMIN_ROLE);

    expect(await shadow.hasRole(DEFAULT_ADMIN_ROLE, alice.address)).to.equal(true);
    expect(await shadow.hasRole(MINTER_ROLE, bob.address)).to.equal(true);

    const revokeRoleTx = await shadow.revokeRole(MINTER_ROLE, bob.address);
    await revokeRoleTx.wait();

    expect(await shadow.hasRole(MINTER_ROLE, bob.address)).eq(false);
    expect(await shadow.getRoleAdmin(DEFAULT_ADMIN_ROLE)).eq(DEFAULT_ADMIN_ROLE);

    const grantTx = await shadow.grantRole(DEFAULT_ADMIN_ROLE, bob.address);
    await grantTx.wait();

    expect(await shadow.hasRole(DEFAULT_ADMIN_ROLE, bob.address)).to.equal(true);

    const renounceTx = await shadow.connect(bob).renounceRole(DEFAULT_ADMIN_ROLE, bob.address);
    await renounceTx.wait();
    expect(await shadow.hasRole(DEFAULT_ADMIN_ROLE, bob.address)).to.equal(false);

    await (await shadow.grantRole(MINTER_ROLE, alice.address)).wait();
    expect(await shadow.hasRole(MINTER_ROLE, alice.address)).to.equal(
      true,
      'Alice should have MINTER_ROLE after grant'
    );
  });

  it('Should update balance after mint', async function () {
    const [alice, bob, charlie] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com/', alice.address, alice.address);
    await shadow.deployed();

    await (await shadow.mint(bob.address, 1)).wait();

    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(alice.address)).to.equals(BigNumber.from(0));

    await expect(shadow.transferFrom(alice.address, charlie.address, 1)).to.rejectedWith('is not owner nor approved');

    await (await shadow.connect(bob).transferFrom(bob.address, charlie.address, 1)).wait();
    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(0));
    expect(await shadow.balanceOf(charlie.address)).to.equals(BigNumber.from(1));

    await expect(
      shadow.connect(charlie).transferFrom(charlie.address, '0x0000000000000000000000000000000000000000', 1)
    ).to.rejectedWith('transfer to the zero address', 'Should not transfer to the zero address');
  });

  it('Should update balance after batch mint', async function () {
    const [alice, bob, charlie, dave] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com', alice.address, alice.address);
    await shadow.deployed();

    const mintBatchTx = await shadow.mintBatchMultiAccounts(
      [bob.address, charlie.address, dave.address, bob.address],
      [1, 2, 3, 4]
    );
    await mintBatchTx.wait();

    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(2));
    expect(await shadow.balanceOf(charlie.address)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(dave.address)).to.equals(BigNumber.from(1));

    expect(await shadow.ownerOf(1)).to.equals(bob.address);
    expect(await shadow.ownerOf(4)).to.equals(bob.address);
  });

  it('Should return correct tokenURI when token exists', async function () {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com/', alice.address, alice.address);
    await shadow.deployed();

    await expect(shadow.tokenURI(1)).to.be.rejected;

    await (await shadow.mint(bob.address, 1)).wait();
    expect(await shadow.tokenURI(1)).to.equals('https://example.com/1');

    await (await shadow.setBaseURI('https://changed.com/')).wait();
    expect(await shadow.tokenURI(1)).to.equals('https://changed.com/1');

    await expect(Promise.resolve(1)).eventually.equals(1);
    await expect(shadow.tokenURI(1)).to.be.fulfilled;
  });

  it('Should throw error when trying setURI without admin role', async () => {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com/', alice.address, alice.address);
    await shadow.deployed();

    await expect(shadow.connect(bob).setBaseURI('https://hacked-by-bob.com/')).to.be.rejected;
  });

  it('Should transferable after approve', async () => {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com/', alice.address, alice.address);
    await shadow.deployed();

    await (await shadow.mint(alice.address, 1)).wait();
    await (await shadow.mint(alice.address, 2)).wait();

    expect(await shadow.balanceOf(alice.address)).to.equals(BigNumber.from(2));
    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(0));

    await expect(shadow.connect(bob).transferFrom(alice.address, bob.address, 1)).to.rejectedWith(
      'is not owner nor approved'
    );

    await (await shadow.connect(alice).approve(bob.address, 1)).wait();
    await (await shadow.connect(bob).transferFrom(alice.address, bob.address, 1)).wait();

    expect(await shadow.balanceOf(alice.address)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(1));

    await expect(shadow.connect(bob).transferFrom(alice.address, bob.address, 2)).to.rejectedWith(
      'is not owner nor approved'
    );
  });

  it('Should transferable after setApprovalForAll', async () => {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC721');
    const shadow = await Shadow.deploy('https://example.com/', alice.address, alice.address);
    await shadow.deployed();

    await (await shadow.mint(alice.address, 1)).wait();
    await (await shadow.mint(alice.address, 2)).wait();

    expect(await shadow.balanceOf(alice.address)).to.equals(BigNumber.from(2));
    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(0));

    await expect(shadow.connect(bob).transferFrom(alice.address, bob.address, 1)).to.rejectedWith(
      'is not owner nor approved'
    );

    await (await shadow.connect(alice).setApprovalForAll(bob.address, true)).wait();
    await (await shadow.connect(bob).transferFrom(alice.address, bob.address, 1)).wait();

    expect(await shadow.balanceOf(alice.address)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(1));

    await (await shadow.connect(bob).transferFrom(alice.address, bob.address, 2)).wait();

    expect(await shadow.balanceOf(alice.address)).to.equals(BigNumber.from(0));
    expect(await shadow.balanceOf(bob.address)).to.equals(BigNumber.from(2));
  });
});
