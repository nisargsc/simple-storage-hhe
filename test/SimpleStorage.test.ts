import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";

describe("SimpleStorage", function () {
  async function deploySimpleStorageFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const simpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    const simpleStorage =
      (await simpleStorageFactory.deploy()) as SimpleStorage;

    return { simpleStorageFactory, simpleStorage, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { simpleStorage, owner } = await loadFixture(
        deploySimpleStorageFixture
      );
      expect(await simpleStorage.owner()).to.equal(owner.address);
    });

    it("Should have favoriteNumber set to zero", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
      expect((await simpleStorage.favoriteNumber()).toString()).to.equal("0");
    });
  });

  describe("Storage", function () {
    describe("Validations", function () {
      it("Should fail to store if caller is not owner", async function () {
        const { simpleStorage, otherAccount } = await loadFixture(
          deploySimpleStorageFixture
        );
        const favoriteNumber = 5;
        await expect(
          simpleStorage.connect(otherAccount).store(favoriteNumber)
        ).to.revertedWithCustomError(simpleStorage, "Unauthorized");
      });

      it("Should not fail to store if caller is owner", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
        const favoriteNumber = 5;
        await expect(simpleStorage.store(favoriteNumber)).to.not.reverted;
      });

      it("Should not fail to addPerson for any account", async function () {
        const { simpleStorage, otherAccount } = await loadFixture(
          deploySimpleStorageFixture
        );
        const name = "Person";
        const favoriteNumber = 5;
        await expect(
          simpleStorage.connect(otherAccount).addPerson(name, favoriteNumber)
        ).to.not.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit NumberStored event", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
        const favoriteNumber = 5;
        await expect(simpleStorage.store(favoriteNumber))
          .to.emit(simpleStorage, "NumberStored")
          .withArgs(favoriteNumber);
      });

      it("Should emit PersonAdded event", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
        const name = "Person";
        const favoriteNumber = 5;
        await expect(simpleStorage.addPerson(name, favoriteNumber))
          .to.emit(simpleStorage, "PersonAdded")
          .withArgs(name, favoriteNumber);
      });
    });

    describe("FavoriteNumber", function () {
      it("Should give zero on retrieve call before store", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        expect((await simpleStorage.retrieve()).toString()).to.equal("0");
      });

      it("Should give correct favoriteNumber on retrieve call after store", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
        const favoriteNumber = 5;
        await simpleStorage.store(favoriteNumber);

        expect(await simpleStorage.retrieve()).to.equal(favoriteNumber);
      });
    });

    describe("Person", function () {
      it("Should store correct person information", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
        const name = "Person";
        const favoriteNumber = 5;
        simpleStorage.addPerson(name, favoriteNumber);

        expect(await simpleStorage.nameToFavoriteNumber(name)).to.equal(
          favoriteNumber
        );
      });
    });
  });
});
