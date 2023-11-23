import React, { Dispatch, SetStateAction } from 'react'

interface IAddEntryModal {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  handleFormSubmit: any
  activeList: any
  handleImageUpload: any
  depositParams: any
  isImageUploadSuccessful: boolean
}

const AddEntryModal: React.FC<IAddEntryModal> = ({
  setIsModalOpen,
  handleFormSubmit,
  activeList,
  handleImageUpload,
  depositParams,
  isImageUploadSuccessful,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-1/2 h-8/10 relative overflow-y-auto">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-800"
        >
          X
        </button>
        <form onSubmit={handleFormSubmit}>
          {/* Contract Address */}
          <div className="mb-1">
            <label
              htmlFor="contractAddress"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Contract Address:
            </label>
            <input
              type="text"
              id="contractAddress"
              name="contractAddress"
              placeholder="Enter contract address"
              className="w-full p-2 border rounded text-gray-800"
              required
            />
          </div>
          {activeList === 'Tags' && (
            <>
              {/* Public Name Tag */}

              <div className="mb-1">
                <label
                  htmlFor="publicNameTag"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Public Name Tag:
                </label>
                <input
                  type="text"
                  id="publicNameTag"
                  name="publicNameTag"
                  placeholder="Enter public name tag"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>

              {/* Project Name */}
              <div className="mb-1">
                <label
                  htmlFor="projectName"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Project Name:
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="Enter project name"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>

              {/* UI/Website Link */}
              <div className="mb-1">
                <label
                  htmlFor="uiLink"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  UI/Website Link:
                </label>
                <input
                  type="url"
                  id="uiLink"
                  name="uiLink"
                  placeholder="Enter UI or website link"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>

              {/* Public Note */}
              <div className="mb-1">
                <label
                  htmlFor="publicNote"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Public Note:
                </label>
                <textarea
                  id="publicNote"
                  name="publicNote"
                  placeholder="Enter public note"
                  className="w-full p-2 border rounded text-gray-800"
                  rows={4}
                ></textarea>
              </div>
            </>
          )}
          {activeList === 'CDN' && (
            <>
              {/* Domain Name */}
              <div className="mb-1">
                <label
                  htmlFor="domainName"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Domain Name:
                </label>
                <input
                  type="text"
                  id="domainName"
                  name="domainName"
                  placeholder="Enter domain name"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>

              {/* Visual Proof */}
              <div className="mb-1">
                <label className="block text-sm font-bold mb-2 text-gray-800">
                  Visual Proof:
                </label>
                <input
                  type="file"
                  data-uri=""
                  id="visualProof"
                  name="visualProof"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>

              {/* ... The rest of your fields here ... */}
            </>
          )}
          {activeList === 'Tokens' && (
            <>
              <div className="mb-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  maxLength={40}
                  placeholder="Enter name"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-1">
                <label
                  htmlFor="symbol"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Symbol:
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  maxLength={20}
                  placeholder="Enter symbol"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-1">
                <label
                  htmlFor="decimals"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Decimals:
                </label>
                <input
                  type="number"
                  id="decimals"
                  name="decimals"
                  placeholder="Enter decimals"
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-1">
                <label className="block text-sm font-bold mb-2 text-gray-800">
                  Logo:
                </label>
                <input
                  type="file"
                  data-uri=""
                  id="logoImage"
                  name="logoImage"
                  accept=".png"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
            </>
          )}
          {depositParams ? (
            <p className="text-gray-600">
              Submission Base Deposit:{' '}
              {depositParams.submissionBaseDeposit +
                depositParams.arbitrationCost}{' '}
              xDAi
            </p>
          ) : null}

          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 rounded ${
              activeList !== 'Tags' && !isImageUploadSuccessful
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
            disabled={activeList !== 'Tags' && !isImageUploadSuccessful}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
export default AddEntryModal
