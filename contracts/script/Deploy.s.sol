// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {AnimatronikContract} from "../src/AnimatronikContract.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();
        AnimatronikContract animatronik = new AnimatronikContract();
        console.log("AnimatronikContract deployed to:", address(animatronik));
        vm.stopBroadcast();
    }
}
