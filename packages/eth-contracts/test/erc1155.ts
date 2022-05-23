import { ethers } from 'hardhat';
import { expect } from 'chai';
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from '@iobridge/constants';
import { BigNumber } from 'ethers';

describe('ShadowERC1155', async function () {
  it('Should update role after re-grant/renounce', async function () {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC1155');
    const shadow = await Shadow.deploy('https://example.com', alice.address, bob.address);
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

  it('Should update uri after set', async () => {
    const [alice, bob] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC1155');
    const shadow = await Shadow.deploy('https://example.com', alice.address, bob.address);
    await shadow.deployed();

    expect(await shadow.uri(0)).to.equal('https://example.com');

    await (await shadow.setURI('https://changed.com')).wait();
    expect(await shadow.uri(0)).to.equal('https://changed.com');

    await expect(shadow.connect(bob).setURI('https://bob.com')).to.rejectedWith('missing role');
  });

  it('Should update balance after mint', async function () {
    const [alice, bob, charlie] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC1155');
    const shadow = await Shadow.deploy('https://example.com', alice.address, alice.address);
    await shadow.deployed();

    await (await shadow.mint(bob.address, 1, 1)).wait();

    expect(await shadow.balanceOf(bob.address, 1)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(bob.address, 2)).to.equals(BigNumber.from(0));
    expect(await shadow.balanceOf(alice.address, 1)).to.equals(BigNumber.from(0));

    await expect(shadow.safeTransferFrom(alice.address, charlie.address, 1, 1, '0x')).to.rejectedWith(
      'insufficient balance',
      'Alice should has no permission to transfer'
    );

    await (await shadow.connect(bob).safeTransferFrom(bob.address, charlie.address, 1, 1, '0x')).wait();
    expect(await shadow.balanceOf(bob.address, 1)).to.equals(BigNumber.from(0));
    expect(await shadow.balanceOf(charlie.address, 1)).to.equals(BigNumber.from(1));

    await expect(
      shadow
        .connect(charlie)
        .safeTransferFrom(charlie.address, '0x0000000000000000000000000000000000000000', 1, 1, '0x')
    ).to.rejectedWith('transfer to the zero address', 'Should not transfer to the zero address');

    await expect(shadow.connect(charlie).safeTransferFrom(charlie.address, alice.address, 1, 2, '0x')).to.rejectedWith(
      'insufficient balance'
    );
  });

  it('Should update balance after batch mint', async function () {
    const [alice, bob, charlie, dave] = await ethers.getSigners();

    const Shadow = await ethers.getContractFactory('ShadowERC1155');
    const shadow = await Shadow.deploy('https://example.com', alice.address, alice.address);
    await shadow.deployed();

    const mintBatchTx = await shadow.mintBatchMultiAccounts(
      [bob.address, charlie.address, dave.address, bob.address],
      [1, 2, 3, 4],
      [1, 1, 1, 1]
    );

    await mintBatchTx.wait();

    expect(await shadow.balanceOf(bob.address, 1)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(charlie.address, 2)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(dave.address, 3)).to.equals(BigNumber.from(1));
    expect(await shadow.balanceOf(bob.address, 4)).to.equals(BigNumber.from(1));
  });
});
