interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color =
    status === "COMPLETED"
      ? "green"
      : status === "CONFIRMED"
      ? "yellow"
      : status === "FAILED"
      ? "red"
      : "gray";

  return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
}