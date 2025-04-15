import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon,sepolia,bsc } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AIGen',
  // projectId: '35be664c4dfe4302abed873f7a231f42',
  projectId:'3503f317700e7e520f9929fbdf481a6a',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia,bsc],

});


