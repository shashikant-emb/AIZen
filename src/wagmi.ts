import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon,sepolia } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';

export const config = getDefaultConfig({
  appName: 'My App',
  // projectId: 'YOUR_PROJECT_ID',
  projectId: '35be664c4dfe4302abed873f7a231f42',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
//   providers: [publicProvider()]

});


