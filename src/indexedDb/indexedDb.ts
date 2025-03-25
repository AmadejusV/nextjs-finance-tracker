import { YearlyExpenseReport } from "@/components/financeTracker/model";

export const DB_STORE_NAME = "yearlyReports";

export const openDatabase = (
  storeName: string,
  mode: IDBTransactionMode
): Promise<IDBObjectStore> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("expenseDatabase", 1);

    request.onupgradeneeded = (event) => {
      const db: IDBDatabase = (event.target as IDBRequest).result;

      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "year" });
      }
    };

    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBRequest).result;
      const transaction = db.transaction(storeName, mode);
      const objectStore = transaction.objectStore(storeName);

      resolve(objectStore);
    };

    request.onerror = (event) => {
      const { error } = event.target as IDBRequest;
      console.error("Error opening indexedDb:", error);
      reject(error);
    };
  });
};

export const getDataByYear = (
  objectStore: IDBObjectStore,
  year: number
): Promise<YearlyExpenseReport> => {
  return new Promise((resolve, reject) => {
    const checkRequest: IDBRequest = objectStore.get(year);

    checkRequest.onsuccess = (event: Event) => {
      const data = (event.target as IDBRequest).result;
      resolve(data);
    };

    checkRequest.onerror = (event) => {
      const { error } = event.target as IDBRequest;
      console.error("Error checking data:", error);
      reject(error);
    };
  });
};

export const addData = (
  objectStore: IDBObjectStore,
  data: YearlyExpenseReport
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const addRequest: IDBRequest = objectStore.add(data);

    addRequest.onsuccess = () => {
      console.log("Data added successfully");
      resolve();
    };

    addRequest.onerror = (event) => {
      const { error } = event.target as IDBRequest;
      console.error("Error adding data:", error);
      reject(error);
    };
  });
};

export const updateData = (
  objectStore: IDBObjectStore,
  data: YearlyExpenseReport
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const updateRequest: IDBRequest = objectStore.put(data);

    updateRequest.onsuccess = () => {
      console.log("Data updated successfully");
      resolve();
    };

    updateRequest.onerror = (event) => {
      const { error } = event.target as IDBRequest;
      console.error("Error updating data:", error);
      reject(error);
    };
  });
};

export const getAllData = async (): Promise<YearlyExpenseReport[]> => {
  const objectStore = await openDatabase(DB_STORE_NAME, "readonly");
  return new Promise((resolve, reject) => {
    const getAllRequest: IDBRequest = objectStore.getAll();

    getAllRequest.onsuccess = (event: Event) => {
      const allData = (event.target as IDBRequest)
        .result as YearlyExpenseReport[];

      resolve(allData);
    };

    getAllRequest.onerror = (event) => {
      const { error } = event.target as IDBRequest;
      console.error("Error retrieving all data:", error);
      reject(error);
    };
  });
};

export const deleteData = async (year: number): Promise<void> => {
  const objectStore = await openDatabase("yearlyReports", "readwrite");

  return new Promise((resolve, reject) => {
    const request = objectStore.delete(year);

    request.onsuccess = () => {
      console.log("Data deleted successfully");
      resolve();
    };

    request.onerror = (event) => {
      const { error } = event.target as IDBRequest;
      console.error("Error deleting data:", error);
      reject(error);
    };
  });
};
