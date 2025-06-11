import { useRouter } from 'expo-router';

export function travelToProfile(id: string) {
    const router = useRouter();
    router.push(`/profile/${id}` as any);
}