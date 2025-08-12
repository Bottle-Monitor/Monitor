import { BottleMonitor } from "@bottle-monitor/types";

export function getGloabl(){
    return (window as any as BottleMonitor)
}