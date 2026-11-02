export default function submitManufacturerDetails(
  name,
  event,
  onSaveManufacturerDetails
) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  onSaveManufacturerDetails(name, Object.fromEntries(formData.entries()));
}
