import SingleChatList from '@/components/chat/SingleChatList';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ChatPage = () => {
  const location = useLocation();
  const withAnimation = location.state?.withAnimation ?? false;

  return (
      <AnimatePresence>
        <motion.div
          className="flex-grow overflow-auto p-4"
          initial={{ opacity: withAnimation ? 0 : 1, x: withAnimation ? -50 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
      <h1 className="text-center text-lg font-bold mb-4">채팅</h1>
      <hr className="my-1 -mx-4 w-screen" />
          <SingleChatList />
        </motion.div>
      </AnimatePresence>
  );
};

export default ChatPage;
