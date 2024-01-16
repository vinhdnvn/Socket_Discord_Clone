import { ChatInput } from "@/components/chat/chat-input";
import InputAI from "./Input";
// import Input from "./Input";

const ChatBox = (props: any) => {
 return(
    <div className="w-full">
       <InputAI type="conversation" />
    </div>
 )
}
export default ChatBox;