import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import Link from "next/link";

export const AddUser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    onOpenChange(); // close the modal
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        ➕ Create Page
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ➕ Create Page
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  variant="bordered"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  label="Username"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Link
                  href={`/diary/addpage?username=${username}&title=${title}`}
                >
                  <Button color="primary" onPress={handleCreate}>
                    Create
                  </Button>
                </Link>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
