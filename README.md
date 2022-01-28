# NFT-MARBLE

## project test setting

## SmartContract

로컬 가나슈 Workspace를 만들며 (New Workspace) Gas limit 값 1000000000000000으로 세팅해줍니다.

Workspace 탭의 Add project 버튼을 클릭 후 다운 받은 프로젝트의 truffle-config.js 파일을 추가해줍니다.

> npm install (Openzepplin 라이브러리가 dependency로 추가되어 있습니다.)

> npm install -g truffle (truffle 개발환경 세팅)

1. cd smart-contract (프로젝트 smart-contract 디렉토리 진입)
2. truffle compile
3. truffle migrate (최초 migration 이후 migration에는 --reset 옵션을 줍니다.)
4. 3번의 과정 후에 프로젝트경로/client/src/data-stores에 tokenAbi.json파일과 tokenAddr.js파일이 생성되는 것을 확인합니다.
   (자세한 내용은 프로젝트경로/smart-contract/migrations/ 2_deploy_contracts.js에서 확인하실 수 있습니다.)
5. 테스트에는 최소 3개의 Metamask 계정이 필요합니다. 로컬 가나슈 환경을 메타마스크와 연동 후 가나슈 계정 3개를 메타마스크에 넣어 연동시켜주세요.

# Client(Reactjs) setting

> npm install
