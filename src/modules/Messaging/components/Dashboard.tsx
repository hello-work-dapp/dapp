import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import Steps from '../../../components/Steps';
import HelloWorkContext from '../../../context/helloWork';
import ServiceRegistry from '../../../contracts/ABI/TalentLayerService.json';
import useAllowedTokens from '../../../hooks/useAllowedTokens';
import { useChainId } from '../../../hooks/useChainId';
import { useConfig } from '../../../hooks/useConfig';
import useUserByAddress from '../../../hooks/useUserByAddress';
import { postToIPFS } from '../../../utils/ipfs';
import { getServiceSignature } from '../../../utils/signature';
import { createMultiStepsTransactionToast } from '../../../utils/toast';
import { parseRateAmount } from '../../../utils/web3';
import { XmtpContext } from '../context/XmtpContext';
import useSendMessage from '../hooks/useSendMessage';
import useStreamConversations from '../hooks/useStreamConversations';
import { NON_EXISTING_XMTP_USER_ERROR_MESSAGE } from '../hooks/useStreamMessages';
import { ChatMessageStatus, XmtpChatMessage } from '../utils/types';
import CardHeader from './CardHeader';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';

function Dashboard() {
  const chainId = useChainId();
  const config = useConfig();
  const { account, user } = useContext(HelloWorkContext);
  const provider = useProvider({ chainId });
  const { data: signer } = useSigner({
    chainId,
  });
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [messageContent, setMessageContent] = useState<string>('');
  const router = useRouter();
  const { address } = router.query;
  const selectedConversationPeerAddress = address as string;
  const [sendingPending, setSendingPending] = useState(false);
  const [messageSendingErrorMsg, setMessageSendingErrorMsg] = useState('');
  const allowedTokenList = useAllowedTokens();

  const { sendMessage } = useSendMessage(
    (selectedConversationPeerAddress as string) ? selectedConversationPeerAddress : '',
    account?.address,
  );
  const peerUser = useUserByAddress(selectedConversationPeerAddress);

  // Listens to new conversations ? ==> Yes, & sets them in "xmtp context". Stream stops "onDestroy"
  useStreamConversations();

  const handleXmtpConnect = async () => {
    if (providerState && providerState.initClient && signer) {
      await providerState.initClient(signer);
    }
  };

  const sendNewMessage = async () => {
    if (signer && account?.address && messageContent && providerState && setProviderState) {
      setSendingPending(true);

      let customMessageContent = messageContent;
      if (messageContent.includes('create-gig')) {
        const values = {
          title: messageContent.replace('/create-gig', ''),
          about: '',
          keywords: '',
          rateAmount: 0.001,
          rateToken: ethers.constants.AddressZero,
        };
        const token = allowedTokenList.find(token => token.address === values.rateToken);
        if (!token) {
          console.error('invalid token');
          return;
        }
        const parsedRateAmount = await parseRateAmount(
          values.rateAmount.toString(),
          values.rateToken,
          token.decimals,
        );
        const parsedRateAmountString = parsedRateAmount.toString();
        const cid = await postToIPFS(
          JSON.stringify({
            title: values.title,
            about: values.about,
            keywords: values.keywords,
            role: 'buyer',
            rateToken: values.rateToken,
            rateAmount: parsedRateAmountString,
          }),
        );

        // Get platform signature
        const signature = await getServiceSignature({ profileId: Number(user?.id), cid });

        const contract = new ethers.Contract(
          config.contracts.serviceRegistry,
          ServiceRegistry.abi,
          signer,
        );

        const tx = await contract.createService(
          user?.id,
          process.env.NEXT_PUBLIC_PLATFORM_ID,
          cid,
          signature,
        );

        const newId = await createMultiStepsTransactionToast(
          chainId,
          {
            pending: 'Creating your job...',
            success: 'Congrats! Your job has been added',
            error: 'An error occurred while creating your job',
          },
          provider,
          tx,
          'service',
          cid,
        );

        customMessageContent = messageContent + ' | id:' + newId;
      }

      const sentMessage: XmtpChatMessage = {
        from: account.address,
        to: selectedConversationPeerAddress,
        messageContent: customMessageContent,
        timestamp: new Date(),
        status: ChatMessageStatus.PENDING,
      };
      const cloneState = { ...providerState };
      const allMessages = cloneState.conversationMessages;
      let messages = cloneState.conversationMessages.get(selectedConversationPeerAddress);
      if (messages) {
        // If Last message in error, remove it & try to resend
        if (messageSendingErrorMsg) {
          messages.pop();
          setMessageSendingErrorMsg('');
        }
        messages.push(sentMessage);
        allMessages.set(selectedConversationPeerAddress, messages);
      } else {
        // If no messages, create new ChatMessage array
        allMessages.set(selectedConversationPeerAddress, [sentMessage]);
      }

      try {
        //Send message
        setProviderState({
          ...providerState,
          conversationMessages: allMessages,
        });
        const response = await sendMessage(messageContent);
        // Update message status & timestamp
        sentMessage.status = ChatMessageStatus.SENT;
        sentMessage.timestamp = response.sent;

        messages = allMessages.get(selectedConversationPeerAddress);
        messages?.pop();
        messages?.push(sentMessage);
        setMessageContent('');
      } catch (error) {
        setSendingPending(false);
        setMessageSendingErrorMsg(
          'An error occurred while sending the message. Please try again later.',
        );
        // If message in error, update last message' status to ERROR
        sentMessage.status = ChatMessageStatus.ERROR;
        messages?.pop();
        messages?.push(sentMessage);
        console.error(error);
      } finally {
        if (messages) {
          allMessages.set(selectedConversationPeerAddress, messages);
        }
        setProviderState({
          ...providerState,
          conversationMessages: allMessages,
        });
        setSendingPending(false);
      }
    }
  };

  if (!user) {
    return <Steps />;
  }

  return (
    <div className='mx-auto text-gray-900'>
      {!providerState?.client && account && (
        <div className='flex items-center justify-center pt-16'>
          <button
            type='submit'
            className='bg-redpraha text-white font-bold py-2 px-4 rounded'
            onClick={() => handleXmtpConnect()}>
            Connect to Messaging
          </button>
        </div>
      )}
      {providerState?.client && (
        <div className='-mx-6 -mt-6'>
          <CardHeader peerAddress={selectedConversationPeerAddress} />
          <div className='flex flex-row'>
            {providerState?.client && selectedConversationPeerAddress && (
              <div className='w-full flex flex-col justify-between'>
                <div className='overflow-y-auto'>
                  <MessageList
                    conversationMessages={
                      providerState.conversationMessages.get(selectedConversationPeerAddress) ?? []
                    }
                    selectedConversationPeerAddress={selectedConversationPeerAddress}
                    userId={account?.address as string}
                    peerUserId={selectedConversationPeerAddress}
                    messagesLoading={providerState.loadingMessages}
                    sendingPending={sendingPending}
                    setMessageSendingErrorMsg={setMessageSendingErrorMsg}
                  />
                </div>
                {(!providerState.loadingMessages || messageSendingErrorMsg) && (
                  <MessageComposer
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    sendNewMessage={sendNewMessage}
                    sendingPending={sendingPending}
                    peerUserExistsOnXMTP={
                      messageSendingErrorMsg !== NON_EXISTING_XMTP_USER_ERROR_MESSAGE
                    }
                    peerUserExistsOnTalentLayer={!!selectedConversationPeerAddress}
                  />
                )}
              </div>
            )}
          </div>
          {messageSendingErrorMsg && (
            <div className={'text-center text-xs px-4'}>
              <p className={'text-red-400 ml-1'}>{messageSendingErrorMsg}</p>
            </div>
          )}
          {selectedConversationPeerAddress && !selectedConversationPeerAddress && (
            <div className={'text-center text-xs px-4'}>
              <p className={'text-red-400 ml-1'}>User is not registered</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
