import create from 'zustand';

import nationInfos from './data-stores/nations';

export const useStore = create((set) => ({
	web3: '',
	setWeb3: (web3) =>
		set(() => ({
			web3,
		})),
	lands: [],
	setLands: (lands) => set(() => ({ lands })),
	transactionCount: 0,
	setTransactionCount: (transactionCount) => set(() => ({ transactionCount })),
	account: '',
	setAccount: (account) => set(() => ({ account })),
	isLoading: false,
	setIsLoading: (isLoading) => set(() => ({ isLoading })),
	nationInfos,
	erc721list: [],
	setErc721list: (erc721list) => set(() => ({ erc721list })),
	contractOwner: '',
	setContractOwner: (contractOwner) => set(() => ({ contractOwner })),
}));
