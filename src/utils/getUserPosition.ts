export default function getUserPosition(): Promise<GeolocationPosition | undefined> {
	return new Promise(resolve => {
		navigator.geolocation.getCurrentPosition(resolve, () => {
			resolve(undefined);
		});
	});
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}