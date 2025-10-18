// global.d.ts
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (options: {
          client_id: string;
          callback: (response: any) => void;
        }) => void;
        prompt: () => void;
      };
    };
  };
}
