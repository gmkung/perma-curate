import React, { Dispatch, SetStateAction, useState } from 'react'
import { renderValue } from 'utils/renderValue'
import { statusColorMap } from 'utils/colorMappings'
import ReactMarkdown from 'react-markdown'
import { performEvidenceBasedRequest } from 'utils/performEvidenceBasedRequest'

interface IDetailsModal {
  setIsDetailsModalOpen: Dispatch<SetStateAction<boolean>>
  curateContractAddress: string
  depositParams: any
  itemId: string
  entryStatus: any
  detailsData: any
  evidences: any
}

const DetailsModal: React.FC<IDetailsModal> = ({
  setIsDetailsModalOpen,
  curateContractAddress,
  depositParams,
  itemId,
  entryStatus,
  detailsData,
  evidences,
}) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [evidenceConfirmationType, setEvidenceConfirmationType] = useState('')
  const [evidenceTitle, setEvidenceTitle] = useState('')
  const [evidenceText, setEvidenceText] = useState('')

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 h-3/4 relative text-gray-800 flex flex-col overflow-y-hidden">
        <button
          onClick={() => {
            setIsDetailsModalOpen(false)
            setIsConfirmationOpen(false)
          }}
          className="absolute top-2 right-2 z-10"
        >
          X
        </button>

        {/* Confirmation Box */}
        {isConfirmationOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3/4 bg-gray-100 rounded-lg p-6 text-gray-800 flex flex-col space-y-4">
            <h3>
              {(() => {
                switch (evidenceConfirmationType) {
                  case 'Evidence':
                    return 'Enter the evidence message you want to submit'
                  case 'RegistrationRequested':
                    return 'Provide a reason for challenging this entry'
                  case 'Registered':
                    return 'Provide a reason for removing this entry'
                  case 'ClearingRequested':
                    return 'Provide a reason for challenging this removal request'
                  default:
                    return 'Default message'
                }
              })()}
            </h3>
            <h5>Message title</h5>
            <textarea
              className="w-full p-2 border rounded"
              rows={1}
              value={evidenceTitle}
              onChange={(e) => setEvidenceTitle(e.target.value)}
            ></textarea>
            <h5>Evidence message</h5>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  let result = false // a flag to check if the function execution was successful
                  result = await performEvidenceBasedRequest(
                    curateContractAddress,
                    depositParams,
                    itemId,
                    evidenceTitle,
                    evidenceText,
                    evidenceConfirmationType
                  )

                  // Check if the function was executed successfully
                  if (result) {
                    setIsDetailsModalOpen(false)
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Status-based Button */}
        <button
          onClick={() => {
            setIsConfirmationOpen(true)
            setEvidenceConfirmationType(entryStatus)
          }} // Adjust this if you want a different confirmation for different actions
          className={`absolute top-2 right-16 z-10 rounded-full px-4 py-2 shadow-sm transition-colors
                ${
                  entryStatus === 'Registered'
                    ? 'bg-orange-500 text-white'
                    : entryStatus === 'RegistrationRequested'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
        >
          {entryStatus === 'Registered' && 'Remove entry'}
          {entryStatus === 'RegistrationRequested' && 'Challenge registration'}
          {entryStatus === 'ClearingRequested' && 'Challenge removal'}
        </button>

        {/* DETAILS */}
        <div className="p-8 overflow-y-auto flex-grow ">
          {' '}
          {/* Added margin-top to account for the confirmation box */}
          <h2 className="text-xl font-semibold mb-4">Entry details</h2>
          <div className="p-4 mb-4 border-b-2 border-gray-200">
            <span
              className={`px-2 py-1 text-white rounded ${statusColorMap[entryStatus]}`}
            >
              {entryStatus}
            </span>
            {detailsData &&
              Object.entries(detailsData).map(([key, value], idx) => (
                <div key={idx}>
                  <strong>{key}:</strong> {renderValue(key, value)}
                </div>
              ))}
          </div>
          {/* EVIDENCES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl mb-4">Evidences</h2>
              <button
                onClick={() => {
                  setIsConfirmationOpen(true)
                  setEvidenceConfirmationType('Evidence')
                }} // Trigger the confirmation for submitting evidence
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Evidence
              </button>
            </div>
            {evidences.length > 0 ? (
              evidences.map((evidence, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-100 rounded font-serif shadow-lg"
                >
                  <div className="mb-2">
                    <strong>Title:</strong> {evidence.title}
                  </div>
                  <div className="mb-2">
                    <strong>Description:</strong>
                    <ReactMarkdown>{evidence.description}</ReactMarkdown>
                  </div>
                  <div className="mb-2">
                    <strong>Time:</strong> {evidence.time}
                  </div>
                  <div>
                    <strong>Party:</strong> {evidence.party}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-light-gray italic">
                No evidence submitted yet...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default DetailsModal
