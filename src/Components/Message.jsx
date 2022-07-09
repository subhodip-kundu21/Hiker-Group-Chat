import React from 'react';
import { HStack, Avatar, Text, VStack } from "@chakra-ui/react";

const Message = ({ text, uri, user = "other", time }) => {
    // console.log(time);

    return (
        <HStack alignSelf={user === "me" ? "flex-end" : "flex-start"} borderRadius={"base"} bg={user === "me" ? "#B8F1B0" : "#F2F2F2"}>
        <VStack>
        <HStack paddingY={"2"} paddingX={user === "me" ? "4" : "2"}>
            {
                user === "other" && <Avatar src={uri} />
            }
            <Text>{text}</Text>
            {
                user === "me" && <Avatar src={uri} />
            }
        </HStack>
            <Text alignSelf={"flex-end"} paddingX={"1"}><small>{time}</small></Text>
            </VStack>
        </HStack>
    )
}

export default Message;