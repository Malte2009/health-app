import { defineStore } from "pinia";
import type { bodyLog } from "@/types/bodyType.ts";
import { getBodyLogs } from "@/services/bodyService.ts";

export const useBodyStore = defineStore("body", {
  state: () => ({
    bodyLogs: [] as Array<bodyLog>,
  }),
  actions: {
    getBodyLogs() {
      return this.bodyLogs;
    },
    setBodyLogs(bodyLogs: Array<bodyLog>) {
      this.bodyLogs = bodyLogs;
    },

    addBodyLog(bodyLog: bodyLog) {
      this.bodyLogs.unshift(bodyLog);
    },

    editBodyLog(updatedBodyLog: bodyLog) {
      const index = this.bodyLogs.findIndex(bodyLog => bodyLog.id === updatedBodyLog.id);
      if (index !== -1) {
        this.bodyLogs[index] = updatedBodyLog;
      }
    },

    deleteBodyLog(bodyLogId: string) {
      this.bodyLogs = this.bodyLogs.filter(bodyLog => bodyLog.id !== bodyLogId);
    },

    async loadBodyLogs() {
      this.bodyLogs = await getBodyLogs();
      return this.bodyLogs;
    }
  }
});
