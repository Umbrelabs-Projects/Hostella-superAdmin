// src/app/dashboard/broadcast/_hooks/useBroadcastApi.ts

import { apiFetch } from "@/lib/api";
import { useBroadcastStore } from "@/stores/useBroadcastStore";
import { BroadcastMessage, BroadcastComposer, BroadcastMessageStatus, BroadcastPriority } from "@/types/broadcast";
import { toast } from "sonner";

export function useBroadcastApi() {
  const {
    setMessages,
    setTotalMessages,
    setLoading,
    setError,
    setSuccess,
    updateMessage: updateMessageInStore,
    addMessage: addMessageToStore,
    removeMessage: removeMessageFromStore,
  } = useBroadcastStore();

  const fetchMessages = async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    status: "all" | BroadcastMessageStatus = "all",
    priority: "all" | BroadcastPriority = "all"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);
      if (priority !== "all") params.append("priority", priority);

      const response = await apiFetch<{
        messages: BroadcastMessage[];
        total: number;
        page: number;
        pageSize: number;
      }>(`/broadcasts?${params.toString()}`, {
        method: "GET",
      });

      setMessages(response.messages);
      setTotalMessages(response.total);
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch messages";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  const sendMessage = async (message: BroadcastComposer) => {
    setLoading(true);
    setError(null);
    try {
      const newMessage = await apiFetch<BroadcastMessage>("/broadcasts", {
        method: "POST",
        body: JSON.stringify(message),
      });

      addMessageToStore(newMessage);
      setSuccess("Message sent successfully");
      toast.success("Message sent successfully");
      setLoading(false);
      return newMessage;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send message";
      setError(message);
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const scheduleMessage = async (message: BroadcastComposer) => {
    setLoading(true);
    setError(null);
    try {
      const scheduledMessage = await apiFetch<BroadcastMessage>(
        "/broadcasts/schedule",
        {
          method: "POST",
          body: JSON.stringify(message),
        }
      );

      addMessageToStore(scheduledMessage);
      setSuccess("Message scheduled successfully");
      toast.success("Message scheduled successfully");
      setLoading(false);
      return scheduledMessage;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to schedule message";
      setError(message);
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const updateMessage = async (
    messageId: string,
    updates: Partial<BroadcastMessage>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiFetch<BroadcastMessage>(
        `/broadcasts/${messageId}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        }
      );

      updateMessageInStore(updated);
      setSuccess("Message updated successfully");
      toast.success("Message updated successfully");
      setLoading(false);
      return updated;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update message";
      setError(message);
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/broadcasts/${messageId}`, {
        method: "DELETE",
      });

      removeMessageFromStore(messageId);
      setSuccess("Message deleted successfully");
      toast.success("Message deleted successfully");
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete message";
      setError(message);
      toast.error(message);
      setLoading(false);
      throw error;
    }
  };

  return {
    fetchMessages,
    sendMessage,
    scheduleMessage,
    updateMessage,
    deleteMessage,
  };
}

