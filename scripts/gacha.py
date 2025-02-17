import arkprts
import asyncio
import json
import sys
import time


async def main() -> None:
    endpoint = 'gacha/getPoolDetail'

    if len(sys.argv) <= 1:
        return

    try:
        auth = arkprts.GuestAuth(max_sessions=1)
        auth.network.default_server = "en"
        client = arkprts.Client(auth)

        sys.stdout.write("[")
        for i in range(1, len(sys.argv)):
            time.sleep(2)  # avoid rate limit

            payload = f'{{"poolId": "{sys.argv[i]}"}}'
            data = await client.auth.auth_request(endpoint, json=payload and json.loads(payload), handle_errors=False)
            json.dump(data, sys.stdout, indent=4, ensure_ascii=False)
            if i < len(sys.argv) - 1:
                sys.stdout.write(",\n")
        sys.stdout.write("]")
    finally:
        await client.auth.network.close()

if __name__ == "__main__":
    asyncio.run(main())
