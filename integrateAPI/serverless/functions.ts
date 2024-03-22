import type { AWS } from '@serverless/typescript';

const functions: AWS['functions'] = {
    integrationsAPI: {
        handler: "src/functions/integrationsAPI/index.handler",
        events: [
            {
                httpApi: {
                    path: "/gameDeals",
                    method: "get",
                } 
                
            }
        ]
    }
}

export default functions

