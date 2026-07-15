import { IEvent } from "@/database";
import Image from "next/image";
import Link from "next/link";
import styles from "./EventCard.module.css";

export type EventType = "hackathon" | "workshop" | "conference" | "meetup";

// const TYPE_LABELS: Record<EventType, string> = {
//   hackathon: "Hackathon",
//   workshop: "Workshop",
//   conference: "Conference",
//   meetup: "Meetup",
// };

const EventCard = ({ props }: { props: IEvent }) => {
  return (
    <Link href={`/events/${props.slug}`} className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <Image
          src={props.image}
          alt={props.title}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* <span className={`${styles.badge} badge-${type}`}>
          {TYPE_LABELS[type]}
        </span> */}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.title}>{props.title}</p>

        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <Image
              src="/icons/calendar.svg"
              alt=""
              width={13}
              height={13}
              className={styles.icon}
            />
            <span>{props.date}</span>
          </div>
          <div className={styles.metaRow}>
            <Image
              src="/icons/pin.svg"
              alt=""
              width={13}
              height={13}
              className={styles.icon}
            />
            <span>{props.location}</span>
            <span className={styles.separator}>·</span>
            <Image
              src="/icons/mode.svg"
              alt=""
              width={13}
              height={13}
              className={styles.icon}
            />
            <span className={styles.capitalize}>{props.mode}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
