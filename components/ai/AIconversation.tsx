'use client';
import Image from "next/image";
import { ChatWelcome } from "../chat/chat-welcome";
import ChatBox from "./components/ChatBox";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formSchema } from "./components/constants";
import { Form, FormField, FormItem , FormControl} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { Input } from "../ui/input";
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage } from "openai";
// import toast from "react-hot-toast";

// visualize the conversation


const AIConversation = (props: any) => {
    const router = useRouter();
    // const proModal = useProModal();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    // const [messages, setMessages] = useState<any[]>([]);

  //   const messages = [
  //     {
  //         role: "user",
  //         content: "How do I calculate the radius of a circle?"
  //     },
  //     {
  //         role: "bot",
  //         content: "What is the diameter of the circle?"
  //     },
  //     {
  //         role: "user",
  //         content: "The diameter is 5 cm."
  //     },
  //     {
  //         role: "bot",
  //         content: "The radius is 2.5 cm."
  //     },
  //     {
  //         role: "user",
  //         content: "Thank you."
  //     },
  //     {
  //         role: "bot",
  //         content: "You're welcome."
  //     },
  
  // ]
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: ""
      }
    });
  
    const isLoading = form.formState.isSubmitting;
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
        const newMessages = [...messages, userMessage];
        
        const response = await axios.post('/api/conversations', { messages: newMessages });
        setMessages((current) => [...current, userMessage, response.data]);
        
        form.reset();
      } catch (error: any) {
        if (error?.response?.status === 403) {
        //   proModal.onOpen();
        console.log("error");
        alert("error");

        } else {
        //   toast.error("Something went wrong.");
        alert("Something went wrong.");
        }
      } finally {
        router.refresh();
      }
    }
  
    return (
        <div className="h-full flex flex-col">
            <div className="mt-4">
            <Image className="rounded-full md:ml-6 " src="/mentalHealth.jpg" width={100} height={100}  alt="this is image"/> 
            <ChatWelcome  name="Mental Health" type="conversation" />
            </div>

            <div>
                 <div>
    
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} 
                        placeholder="How do I calculate the radius of a circle?" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} >
                Generate
              </button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              {/* <Loader /> */}
              Loading........
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            // <Empty label="No conversation started." />
            "No conversation started."
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div 
                key={message.content} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar src="" /> : 'bot avatr'}
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
            </div>
          {/* <ChatBox/> */}

        </div>
    )
}
export default AIConversation;