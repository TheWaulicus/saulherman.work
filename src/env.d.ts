/// <reference types="astro/client" />

interface Window {
  navigation?: {
    activation?: {
      from?: { url?: string };
      entry?: { url?: string };
    };
  };
}
