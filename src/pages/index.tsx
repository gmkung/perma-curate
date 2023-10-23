declare global {
    interface Window {
        ethereum: any;
    }
}

import { useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';

import { formatEther, parseEther } from '@ethersproject/units';

import '../../styles/globals.css';
import klerosCurateABI from '@/utils/abi/kleros-curate-abi.json';
import arbitratorABI from '@/utils/abi/kleros-liquid-abi.json';
import tagsItemTemplate from '@/assets/tags-item-template.json';
import { fetchTags } from '@/utils/getAddressTagsFromSubgraph';

import { references } from '@/utils/chains';  // Adjust the path according to your folder structure

import { chainColorMap, statusColorMap } from '@/utils/colorMappings'

// Constants
const TAGSCONTRACTADDRESS = "0x66260C69d03837016d88c9877e61e08Ef74C59F2";
const ARBITRATORCONTRACTADDRESS = "0x9C1dA9A04925bDfDedf0f6421bC7EEa8305F9002";
const PROVIDER = new JsonRpcProvider('https://rpc.ankr.com/gnosis'); // Assuming Gnosis chain uses xDai's endpoint.
const CONTRACT = new Contract(TAGSCONTRACTADDRESS, klerosCurateABI, PROVIDER);
const ARBCONTRACT = new Contract(ARBITRATORCONTRACTADDRESS, arbitratorABI, PROVIDER);
// Fetching the deposit params
let submissionBaseDeposit: number;
let submissionChallengeBaseDeposit: number;
let removalBaseDeposit: number;
let removalChallengeBaseDeposit: number;
let arbitratorExtraData: string;
let arbitrationCost: number;

CONTRACT.arbitratorExtraData()
    .then(result => {
        arbitratorExtraData = result;

        return Promise.all([
            CONTRACT.submissionBaseDeposit(),
            CONTRACT.submissionChallengeBaseDeposit(),
            CONTRACT.removalBaseDeposit(),
            CONTRACT.removalChallengeBaseDeposit(),
            ARBCONTRACT.arbitrationCost(arbitratorExtraData)
        ]);
    })
    .then(results => {
        submissionBaseDeposit = parseFloat(formatEther(results[0]));
        submissionChallengeBaseDeposit = parseFloat(formatEther(results[1]));
        removalBaseDeposit = parseFloat(formatEther(results[2]));
        removalChallengeBaseDeposit = parseFloat(formatEther(results[3]));
        arbitrationCost = parseFloat(formatEther(results[4]));
    })
    .catch(error => {
        console.error("Error fetching deposit params:", error);
    });

const postJSONtoKlerosIPFS = async (object: Record<string, any>) => {
    const json_string = JSON.stringify(object);
    const json_bytes = new TextEncoder().encode(json_string);
    const buffer_data = Array.from(json_bytes);

    const final_dict = {
        "fileName": "evidence.json",
        "buffer": { "type": "Buffer", "data": buffer_data }
    };

    const response = await fetch("https://ipfs.kleros.io/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(final_dict)
    });

    if (response.ok) {
        const data = await response.json();
        return "/ipfs/" + data.data[0].hash;
    } else {
        throw new Error("Failed to upload to IPFS");
    }
};

const fetchFromIPFS = async (ipfsURI: string) => {
    try {
        const response = await fetch(`https://ipfs.kleros.io${ipfsURI}`);
        const data = await response.json();
        console
        return data;
    } catch (error) {
        console.error("Failed to fetch from IPFS:", error);
    }
};

async function performEvidenceBasedRequest(itemId: string, evidenceTitle: string, evidenceText: string, requestType: string): Promise<boolean> {
    try {
        // Construct the JSON object with title and description
        const evidenceObject = {
            title: evidenceTitle,  // Add your desired title
            description: evidenceText
        };

        // Post the JSON object to Kleros IPFS
        const ipfsURL = await postJSONtoKlerosIPFS(evidenceObject);
        console.log("Evidence URL: ", ipfsURL)

        // Ensure MetaMask or an equivalent provider is available
        if (!window.ethereum) {
            throw new Error("Ethereum provider not found!");
        }

        // Initialize the provider from MetaMask or any injected Ethereum provider
        //const provider = new Web3Provider(window.ethereum);//
        const provider = new ethers.BrowserProvider(window.ethereum)

        //const signer = provider.getSigner();
        const signer = await provider.getSigner();
        // Prompt the user to connect their wallet
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create an instance of the contract
        const contract = new Contract(TAGSCONTRACTADDRESS, klerosCurateABI, signer);

        let transactionResponse;
        let etherAmount;

        switch (requestType) {
            case 'Evidence':
                etherAmount = ethers.parseEther("0"); // adjust the ether amount calculation as needed
                transactionResponse = await contract.submitEvidence(itemId, ipfsURL, { value: etherAmount });
                break;
            case 'RegistrationRequested':
                etherAmount = ethers.parseEther((arbitrationCost + submissionChallengeBaseDeposit).toString()); // adjust the ether amount calculation as needed
                transactionResponse = await contract.challengeRequest(itemId, ipfsURL, { value: etherAmount });
                break;
            case 'Registered':
                etherAmount = ethers.parseEther((arbitrationCost + removalBaseDeposit).toString()); // adjust the ether amount calculation as needed
                transactionResponse = await contract.removeItem(itemId, ipfsURL, { value: etherAmount });
                break;
            case 'ClearingRequested':
                etherAmount = ethers.parseEther((arbitrationCost + removalChallengeBaseDeposit).toString()); // adjust the ether amount calculation as needed
                transactionResponse = await contract.challengeRequest(itemId, ipfsURL, { value: etherAmount });
                break;
            default:
                throw new Error(`Unknown request type: ${requestType}`);
        }

        console.log("Transaction hash:", transactionResponse.hash);

        // Wait for the transaction to be confirmed
        const receipt = await transactionResponse.wait();
        console.log("Transaction was mined in block", receipt.blockNumber);

        return true;
    } catch (error) {
        console.error("Error submitting evidence:", error);
        return false;
    }
}


async function initiateTransactionToCurate(ipfsPath: string): Promise<boolean> {
    try {
        // Ensure MetaMask or an equivalent provider is available
        if (!window.ethereum) {
            throw new Error("Ethereum provider not found!");
        }

        // Initialize the provider from MetaMask or any injected Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();

        // Prompt the user to connect their wallet
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create an instance of the contract
        const contract = new Contract(TAGSCONTRACTADDRESS, klerosCurateABI, signer);

        // Define the ether amount you want to send. This is just an example; adjust accordingly.
        const etherAmount = ethers.parseEther((arbitrationCost + submissionBaseDeposit).toString()); // calculating ETH/xDai costs using arbitrationCost+submissionBaseDeposit

        // Send the transaction
        const transactionResponse = await contract.addItem(ipfsPath, { value: etherAmount });

        console.log("Transaction hash:", transactionResponse.hash);

        // Wait for the transaction to be confirmed
        const receipt = await transactionResponse.wait();
        console.log("Transaction was mined in block", receipt.blockNumber);

        return true;
    } catch (error) {
        console.error("Error initiating transaction:", error);
        return false;
    }
}

const Home = ({ }: { items: any }) => {
    //Initiation
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    //navigation and search
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //for the pop-up to display details and evidence
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [evidenceConfirmationType, setEvidenceConfirmationType] = useState('');
    const [evidenceTitle, setEvidenceTitle] = useState('');
    const [evidenceText, setEvidenceText] = useState('');
    const [detailsData, setDetailsData] = useState(null);
    const [evidences, setEvidences] = useState<any[]>([]);
    const [entryStatus, setEntryStatus] = useState('');
    const [itemId, setItemId] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const fetchedItems = await fetchTags();
                setItems(fetchedItems as any);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);


    const handleEntryClick = async (item: any) => {
        const details = await fetchFromIPFS(item.data);
        setDetailsData(details.values);
        setEntryStatus(item.status)
        setItemId(item.itemID)

        // Fetch evidences
        const evidenceData = await item.requests[item.numberOfRequests - 1].evidences; // Assuming you have this function or something similar
        const formattedEvidences = await Promise.all(
            evidenceData.map(async (e: any) => {
                const evi = await fetchFromIPFS(e.URI);
                return {
                    title: evi.title,
                    description: evi.description,
                    time: new Date(e.timestamp * 1000).toLocaleString("en-GB"),
                    party: e.party,
                };
            })
        );
        setEvidences(formattedEvidences as any);

        setIsDetailsModalOpen(true);
    };


    const itemsPerPage = 20;

    // Filter and paginate data
    const filteredData = items.filter((item: any) => {
        for (let key in item) {
            if (typeof item[key] === 'string' && item[key].includes(searchTerm)) {
                return true;
            } else if (typeof item[key] === 'number' && item[key].toString().includes(searchTerm)) {
                return true;
            }
            // Add more conditions if there are other data types to consider.
        }
        return false;
    });

    const displayedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    //For pagination
    const [pageInput, setPageInput] = useState<number>(1);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const dataObject = {
            "Contract Address": formData.get("contractAddress"),
            "Address": formData.get("address"),
            "Public Name Tag": formData.get("publicNameTag"),
            "Project Name": formData.get("projectName"),
            "UI/Website Link": formData.get("uiLink"),
            "Public Note": formData.get("publicNote")
        };

        const formattedData = {
            ...tagsItemTemplate,
            values: dataObject
        };

        console.log(formattedData);


        // Step 3: Store the JSON object in IPFS using Kleros's node
        const ipfsPath = await postJSONtoKlerosIPFS(formattedData);
        console.log(ipfsPath)

        // Step 4: Initiate a transaction to Curate's contract (Placeholder)
        // You will need a function that interacts with the Ethereum blockchain to submit the data to Curate's contract.
        const transactionSuccess = await initiateTransactionToCurate(ipfsPath);

        // Step 5: Close the pop-up
        if (transactionSuccess) {
            // Only close the modal if the transaction was successful
            setIsModalOpen(false);
        } else {
            // Optionally, show an error message to the user here
            console.error("Transaction failed.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 min-h-screen text-white font-orbitron p-8">
            <h1 className="text-5xl text-center mb-4 flex justify-center items-center">
                <img src="https://cryptologos.cc/logos/kleros-pnk-logo.svg?v=026" alt="Kleros" className="mr-4 h-[3rem]" />
                Kleros Tags
            </h1>
            <p className="text-xl text-center text-purple-300 mb-12">Crowdsourced address tags for the Ethereum ecosystem.</p>

            <div className="w-4/5 mx-auto flex items-center pb-2">
                <label className="bg-purple-600 p-2 rounded-l-lg text-white">Search</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Enter keywords, Ethereum addresses..."
                    className="flex-grow p-2 focus:outline-none border-purple-500 border-l-0 text-gray-800 rounded-r-lg"
                />
            </div>

            <p className="text-center text-xl mb-6">

                Total entries: {filteredData.length}
                <button onClick={() => setIsModalOpen(true)} className="ml-4 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500">
                    Add Entry
                </button>
            </p>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem' }}>
                    <img src="https://assets.materialup.com/uploads/92425af1-601b-486e-ad06-1de737628ca0/preview.gif" alt="Loading..." style={{ height: '8rem' }} />
                </div>
            ) : (null)}

            <div className="w-4/5 mx-auto grid grid-cols-2 gap-6">
                {displayedData.map((item: any, index: number) => {
                    const parts = item.key0.split(':');
                    const keyForReference = `${parts[0]}:${parts[1]}`;
                    const reference = references.find(ref => `${ref.namespaceId}:${ref.id}` === keyForReference);

                    return (
                        <div
                            key={index}
                            className="bg-purple-600 p-4 rounded-lg break-words transform transition-all duration-150 hover:shadow-2xl active:scale-95"
                            onClick={() => handleEntryClick(item)}
                        >

                            <div className="mt-1">
                                <strong>Chain:</strong> <span className={`px-1 py-0 text-white rounded ${chainColorMap[keyForReference] || 'bg-gray-400'}`}>
                                    {reference?.label}
                                </span>
                            </div>
                            <div className="items-center space-x-2">
                                <span>{parts[2]}</span>
                            </div>
                            <div><strong>Project:</strong> {item.key2}</div>
                            <div><strong>Tag/label:</strong> {item.key1}</div>
                            <div><strong>URL:</strong> {item.key3}</div>
                            <div className="mt-2">
                                <span className={`px-2 py-1 text-white rounded ${statusColorMap[item.status] || 'bg-gray-400'}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>



            <div className="w-4/5 mx-auto mt-12 flex justify-between">
                <button
                    className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                >
                    Previous
                </button>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={pageInput}
                        onChange={e => setPageInput(Math.min(Math.max(1, parseInt(e.target.value)), totalPages))} // ensure input stays between 1 and totalPages
                        className="w-16 p-2 rounded-l-lg focus:outline-none border-purple-500 text-gray-800"
                    />
                    <span className="text-white-600">of {totalPages}</span>
                    <button
                        className="bg-purple-600 p-2 rounded-r-lg hover:bg-purple-500"
                        onClick={() => setCurrentPage(pageInput)}
                    >
                        Go
                    </button>
                </div>
                <button
                    className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                >
                    Next
                </button>
            </div>

            <footer className="mt-16 text-center text-purple-400 text-sm">
                © 2023 Kleros Tags. All rights reserved.
            </footer>

            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-1/2 h-8/10 relative overflow-y-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-800">X</button>
                        <form onSubmit={handleFormSubmit}>
                            {/* Contract Address */}
                            <div className="mb-1">
                                <label htmlFor="contractAddress" className="block text-sm font-bold mb-2 text-gray-800">Contract Address:</label>
                                <input type="text" id="contractAddress" name="contractAddress" placeholder="Enter contract address" className="w-full p-2 border rounded text-gray-800" required />
                            </div>

                            {/* Address */}
                            <div className="mb-1">
                                <label htmlFor="address" className="block text-sm font-bold mb-2 text-gray-800">Address:</label>
                                <input type="text" id="address" name="address" placeholder="Enter address" className="w-full p-2 border rounded text-gray-800" required />
                            </div>

                            {/* Public Name Tag */}
                            <div className="mb-1">
                                <label htmlFor="publicNameTag" className="block text-sm font-bold mb-2 text-gray-800">Public Name Tag:</label>
                                <input type="text" id="publicNameTag" name="publicNameTag" placeholder="Enter public name tag" className="w-full p-2 border rounded text-gray-800" required />
                            </div>

                            {/* Project Name */}
                            <div className="mb-1">
                                <label htmlFor="projectName" className="block text-sm font-bold mb-2 text-gray-800">Project Name:</label>
                                <input type="text" id="projectName" name="projectName" placeholder="Enter project name" className="w-full p-2 border rounded text-gray-800" required />
                            </div>

                            {/* UI/Website Link */}
                            <div className="mb-1">
                                <label htmlFor="uiLink" className="block text-sm font-bold mb-2 text-gray-800">UI/Website Link:</label>
                                <input type="url" id="uiLink" name="uiLink" placeholder="Enter UI or website link" className="w-full p-2 border rounded text-gray-800" required />
                            </div>

                            {/* Public Note */}
                            <div className="mb-1">
                                <label htmlFor="publicNote" className="block text-sm font-bold mb-2 text-gray-800">Public Note:</label>
                                <textarea id="publicNote" name="publicNote" placeholder="Enter public note" className="w-full p-2 border rounded text-gray-800" rows={4}></textarea>
                            </div>
                            <p className="text-gray-600">Submission Base Deposit: {submissionBaseDeposit + arbitrationCost} xDAi</p>
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
                        </form>
                    </div>
                </div>
            )}
            {isDetailsModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-3/4 h-3/4 relative text-gray-800 flex flex-col overflow-y-hidden">
                        <button onClick={() => { setIsDetailsModalOpen(false); setIsConfirmationOpen(false) }} className="absolute top-2 right-2 z-10">X</button>

                        {/* Confirmation Box */}
                        {isConfirmationOpen && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3/4 bg-gray-100 rounded-lg p-6 text-gray-800 flex flex-col space-y-4">
                                <h3>
                                    {(() => {
                                        switch (evidenceConfirmationType) {
                                            case 'Evidence': return "Enter the evidence message you want to submit";
                                            case 'RegistrationRequested': return "Provide a reason for challenging this entry";
                                            case 'Registered': return "Provide a reason for removing this entry";
                                            case 'ClearingRequested': return "Provide a reason for challenging this removal request";
                                            default: return "Default message";
                                        }
                                    })()}
                                </h3>
                                <h5>Message title</h5>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    rows={1}
                                    value={evidenceTitle}
                                    onChange={e => setEvidenceTitle(e.target.value)}
                                ></textarea>
                                <h5>Evidence message</h5>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                    value={evidenceText}
                                    onChange={e => setEvidenceText(e.target.value)}
                                ></textarea>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setIsConfirmationOpen(false)}
                                        className="px-4 py-2 border rounded">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            let result = false; // a flag to check if the function execution was successful
                                            result = await performEvidenceBasedRequest(itemId, evidenceTitle, evidenceText, evidenceConfirmationType)


                                            // Check if the function was executed successfully
                                            if (result) {

                                                setIsDetailsModalOpen(false);
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}


                        {/* Status-based Button */}
                        <button
                            onClick={() => { setIsConfirmationOpen(true); setEvidenceConfirmationType(entryStatus); }} // Adjust this if you want a different confirmation for different actions
                            className={`absolute top-2 right-16 z-10 rounded-full px-4 py-2 shadow-sm transition-colors
                ${entryStatus === "Registered" ? "bg-orange-500 text-white" :
                                    entryStatus === "RegistrationRequested" ? "bg-red-500 text-white" :
                                        "bg-red-500 text-white"}`}
                        >
                            {entryStatus === "Registered" && "Remove entry"}
                            {entryStatus === "RegistrationRequested" && "Challenge registration"}
                            {entryStatus === "ClearingRequested" && "Challenge removal"}
                        </button>

                        {/* DETAILS */}
                        <div className="p-8 overflow-y-auto flex-grow "> {/* Added margin-top to account for the confirmation box */}
                            <h2 className="text-xl font-semibold mb-4">Entry details</h2>
                            <div className="p-4 mb-4 border-b-2 border-gray-200">
                                <span className={`px-2 py-1 text-white rounded ${statusColorMap[entryStatus]}`}>
                                    {entryStatus}
                                </span>
                                {detailsData && Object.entries(detailsData).map(([key, value], idx) => (
                                    <div key={idx}>
                                        <strong>{key}:</strong> {value as React.ReactNode}
                                    </div>
                                ))}

                            </div>


                            {/* EVIDENCES */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl mb-4">Evidences</h2>
                                    <button
                                        onClick={() => { setIsConfirmationOpen(true); setEvidenceConfirmationType("Evidence"); }} // Trigger the confirmation for submitting evidence
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        Submit Evidence
                                    </button>
                                </div>
                                {evidences.length > 0 ? (
                                    evidences.map((evidence, idx) => (
                                        <div key={idx} className="p-3 bg-gray-100 rounded font-serif shadow-lg">
                                            <div className="mb-2"><strong>Title:</strong> {evidence.title}</div>
                                            <div className="mb-2"><strong>Description:</strong> {evidence.description}</div>
                                            <div className="mb-2"><strong>Time:</strong> {evidence.time}</div>
                                            <div><strong>Party:</strong> {evidence.party}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-light-gray italic">No evidence submitted yet...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }


        </div >
    );
};

export default Home;