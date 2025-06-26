
import { audioService } from "@/services/audio-service";

export function useTestAdhan() {
  const testAdhan = () => {
    console.log("Testing Adhan audio...");
    audioService.playAdhanAudio();
  };

  return { testAdhan };
}
