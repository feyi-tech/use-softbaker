import React, { useEffect, useState } from 'react'
import { SdkConfig, Tool, Vendor } from '../types';
import useFirebase from '../../Firebase';
import { STORAGE_KEYS, SDK_RETRY_INTERVAL_MINS } from '../../../utils/c';
import { Firestore, doc, getDoc } from 'firebase/firestore';

const useSdkConfig = (siteId: string): {
    sdkConfig: SdkConfig | null | undefined, 
    currentTool: Tool | null | undefined
} => {
    const { db } = useFirebase()
    const [ sdkConfig, setSdkConfig ] = useState<SdkConfig | null | undefined>()
    const [ currentTool, setCurrentTool ] = useState<Tool | null | undefined>()

    useEffect(() => {
        if(!sdkConfig && db && siteId) {
            getSdkConfig(true, db)
        }
    }, [siteId, db])

    function parseTools(toolsAsTexts: string[]): Tool[] {
        // Convert comma-separated strings to objects
        const tools = toolsAsTexts.map((text) => {
          const [id, name, isActive, siteLogoUrl, siteUrl, desktopVideoUrl, mobileVideoUrl] = text.split(',');
          const tool = {
            id,
            name,
            isActive: isActive === 'true', // Convert string to boolean
            siteLogoUrl,
            siteUrl,
            desktopVideoUrl,
            mobileVideoUrl,
          } as Tool;

          return tool
        });
      
        // Prioritize active objects
        return tools.sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
    }

    function parseVendors(vendorsAsTexts: string[]): Vendor[] {
        // Convert comma-separated strings to objects
        const vendors = vendorsAsTexts.map((text) => {
          const [name, number, freq] = text.split(',');
          return {
            name,
            number,
            freq: parseInt(freq),
          } as Vendor;
        });
      
        return vendors;
    }

    const updateSdkConfig = (config: SdkConfig) => {
        setSdkConfig(config)
        for (const tool of config.tools) {
            if(tool.id == siteId) setCurrentTool(tool)
        }
    }

    const getSdkConfig = (useClientCache: boolean, db: Firestore) => {
        if(useClientCache) {
            var cache = localStorage.getItem(STORAGE_KEYS.SDK_CONFIG)
            if(cache && cache.length > 0) {
                const config = JSON.parse(cache) as SdkConfig
                config.min_deposit = Number(config.min_deposit)
                config.min_vendor_deposit = Number(config.min_vendor_deposit)
                config.valid_till = Number(config.valid_till)
                config.ttl_days = Number(config.ttl_days)
                if((new Date()).getTime() < config.valid_till) {
                    updateSdkConfig(JSON.parse(cache) as SdkConfig)
                    return
                }
            }
        }
        
        const sdkDoc = doc(db, "cache/sdk_config")
        getDoc(sdkDoc)
        .then(d => {
            if(d.exists()) {
                const config: SdkConfig = d.data() as SdkConfig
                config.tools = parseTools(d.data().tools)
                config.vendors = parseVendors(d.data().vendors)
                config.valid_till = (new Date()).getTime() + (config.ttl_days * 24 * 60 * 60 * 1000)
                localStorage.setItem(STORAGE_KEYS.SDK_CONFIG, JSON.stringify(config))
                updateSdkConfig(config)

            } else {
                setTimeout(() => {
                    getSdkConfig(false, db)
                }, SDK_RETRY_INTERVAL_MINS * 60 * 1000);
            }
        })
        .catch(() => {
            setTimeout(() => {
                getSdkConfig(false, db)
            }, SDK_RETRY_INTERVAL_MINS * 60 * 1000);
        })
    }

    return {
        sdkConfig, currentTool
    };
}

export default useSdkConfig