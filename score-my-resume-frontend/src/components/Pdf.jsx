import { useState, useRef } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Button,
  Box,
  Toast,
} from "@chakra-ui/react";

const Pdf = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [token, setToken] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
    setPdfUrl(URL.createObjectURL(file));
    setIsFileUploaded(true);
  };

  const handleRemove = () => {
    setPdfFile(null);
    setPdfUrl("");
    setIsFileUploaded(false);
    fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (!pdfFile || !token) return;

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setPdfText(data.text);
    } else {
      console.error("Failed to send PDF to backend");
    }
  };

  return (
    <Flex
      mt={5}
      direction="column"
      justifyContent={"center"}
      alignItems={"center"}
      w={"100%"}
      overflow={"hidden"}
    >
      <FormControl>
        <FormLabel>Upload the file below</FormLabel>
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isFileUploaded}
        />
        {isFileUploaded && (
          <Box mt={5} w="100%">
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              title="PDF Preview"
            />
            <Input
              aria-controls={"none"}
              display={"block"}
              type="text"
              w={"100%"}
              mt={2}
              placeholder="Please enter open AI token"
              required
              onChange={(event) => {
                setToken(event.target.value);
              }}
            />
            <Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
              <Button mt={3} onClick={handleRemove} colorScheme="red">
                Remove File
              </Button>
              <Button mt={3} ml={3} onClick={handleSend} colorScheme="blue">
                Generate Review
              </Button>
            </Flex>
          </Box>
        )}
        {pdfText && <Text mt={5}>{pdfText}</Text>}
      </FormControl>
    </Flex>
  );
};

export default Pdf;
