export default function getUserPosition(): Promise<GeolocationPosition | undefined> {
	return new Promise(resolve => {
		navigator.geolocation.getCurrentPosition(resolve, () => {
			resolve(undefined);
		});
	});
}
