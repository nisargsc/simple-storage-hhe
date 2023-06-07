// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/** @title Simple Storage*/
contract SimpleStorage {
    // Errors //

    /** @notice Throw if unauthorized */
    error Unauthorized();

    // Events //

    /**
     * @notice Emitted when new number is added
     * @param favoriteNumber New value stored
     */
    event NumberStored(uint256 indexed favoriteNumber);

    /**
     * @notice Emitted when new Person is added
     * @param name Name of the Person
     * @param favoriteNumber FavoriteNumber of the Person
     */
    event PersonAdded(string indexed name, uint256 indexed favoriteNumber);

    // State Variables //
    address owner;
    uint256 favoriteNumber;

    struct Person {
        uint256 favoriteNumber;
        string name;
    }
    Person[] public listOfPeople;

    mapping(string => uint256) public nameToFavoriteNumber;

    // Modifiers //
    modifier onlyOwner() {
        if (msg.sender == owner) {
            revert Unauthorized();
        }
        _;
    }

    // Functions //

    constructor() {
        owner = msg.sender;
    }

    /**
     * Store 'favoriteNumber'
     * @param _favoriteNumber The new value to sotre
     * @dev This is a contract level state variable 'favoriteNumber'
     * @dev Only the owner can call this function
     */
    function store(uint256 _favoriteNumber) public onlyOwner {
        favoriteNumber = _favoriteNumber;
        emit NumberStored(_favoriteNumber);
    }

    /**
     * Retrieve 'favoriteNumber'
     * @return _favoriteNumber The stored favoriteNumber
     */
    function retrieve() public view returns (uint256 _favoriteNumber) {
        return favoriteNumber;
    }

    /**
     * Add Person
     * @param _name Name of the Person
     * @param _favoriteNumber FavoriteNumber of the Person
     * @dev This is a public function, hence anyone can add a Person
     */
    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        listOfPeople.push(Person(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
        emit PersonAdded(_name, _favoriteNumber);
    }
}
