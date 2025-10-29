import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertiChainSCModule", (m) => {
  const certiChain = m.contract("CertiChainSC");

  return { certiChain };
});
