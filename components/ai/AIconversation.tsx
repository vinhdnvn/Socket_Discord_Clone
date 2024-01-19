'use client';
import Image from "next/image";
import { ChatWelcome } from "../chat/chat-welcome";
import ChatBox from "./components/ChatBox";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formSchema } from "./components/constants";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { Input } from "../ui/input";
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage } from "openai";
// import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";

// visualize the conversation


const AIConversation = (props: any) => {
  const router = useRouter();
  let [isOpen, setIsOpen] = useState(false)
  // const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);


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
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="flex absolute md:top-[200px] right-7">
        <button
          type="button"
          onClick={openModal}
          className="rounded-full p-3 hover:scale-125 bg-blue-400 transition duration-150 text-sm font-medium "
        >
          <Image className="rounded-full" src="/mentalHealth.jpg" width={50} height={50} alt="this is image" />
        </button>
      </div>
      <Transition show={isOpen}

        as={Fragment}
      >


        <Dialog open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <Transition.Child 
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >

          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"  
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >

            <Dialog.Panel className="mx-auto min-w-[500px] h-full w rounded bg-white">
             
              <div className="mt-4">
                <Image className="rounded-full md:ml-6 " src="/mentalHealth.jpg" width={100} height={100} alt="this is image" />
                <ChatWelcome name="Mental Health" type="conversation" />
              </div>

              <div className=" flex flex-col">


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
                            {/* make a spinner loading animate */}

                            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-200"></div>

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
                              {message.role === "user" ? <UserAvatar src="" /> : <BotAvatar />}
                              <p className="text-sm ">
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
            </Dialog.Panel>
            </Transition.Child>

          </div>


        </Dialog>
      </Transition>
    </>
  )
}
export default AIConversation;


const BotAvatar = () => {
  return (
    <div className="flex-shrink-0">
      <Image className="rounded-full" src="/botAI.jpg" width={50} height={50} alt="this is image" />
    </div>
  )
}