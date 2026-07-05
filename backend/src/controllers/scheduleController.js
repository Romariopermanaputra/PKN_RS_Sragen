const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatTime = (value) => {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(11, 16);
  if (typeof value === 'string') {
    return value.includes(':') ? value.slice(0, 5) : value;
  }
  return String(value);
};

const parseTime = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const [hours, minutes] = trimmed.split(':');
    const parsedHours = Number(hours);
    const parsedMinutes = Number(minutes);

    if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
      return null;
    }

    return new Date(`1970-01-01T${String(parsedHours).padStart(2, '0')}:${String(parsedMinutes).padStart(2, '0')}:00`);
  }

  return null;
};

const normalizeSchedule = (schedule) => ({
  id: schedule.id_jadwal ?? schedule.id,
  doctor_id: schedule.id_dokter ?? schedule.doctor_id ?? null,
  hari: schedule.hari ?? '',
  jam_mulai: formatTime(schedule.jam_mulai),
  jam_selesai: formatTime(schedule.jam_selesai),
  nama_poli: schedule.nama_poli ?? '',
  doctor: schedule.dokter
    ? {
        id: schedule.dokter.id_dokter ?? schedule.dokter.id,
        nama: schedule.dokter.nama_lengkap ?? schedule.dokter.nama ?? 'Dokter',
        spesialis: schedule.dokter.spesialis?.nama_spesialis ?? '',
      }
    : null,
});

exports.getAll = async (req, res) => {
  try {
    const schedules = await prisma.jadwal_praktek.findMany({
      include: {
        dokter: {
          select: {
            id_dokter: true,
            nama_lengkap: true,
            spesialis: { select: { nama_spesialis: true } },
          },
        },
      },
      orderBy: { id_jadwal: 'desc' },
    });
    res.json(schedules.map(normalizeSchedule));
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil jadwal' });
  }
};

exports.create = async (req, res) => {
  try {
    const { doctor_id, hari, jam_mulai, jam_selesai, nama_poli } = req.body;
    const schedule = await prisma.jadwal_praktek.create({
      data: {
        id_dokter: doctor_id ? Number(doctor_id) : null,
        hari,
        jam_mulai: parseTime(jam_mulai),
        jam_selesai: parseTime(jam_selesai),
        nama_poli,
      },
      include: {
        dokter: {
          select: {
            id_dokter: true,
            nama_lengkap: true,
            spesialis: { select: { nama_spesialis: true } },
          },
        },
      },
    });
    res.status(201).json(normalizeSchedule(schedule));
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambah jadwal' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_id, hari, jam_mulai, jam_selesai, nama_poli } = req.body;
    const schedule = await prisma.jadwal_praktek.update({
      where: { id_jadwal: Number(id) },
      data: {
        id_dokter: doctor_id ? Number(doctor_id) : null,
        hari,
        jam_mulai: parseTime(jam_mulai),
        jam_selesai: parseTime(jam_selesai),
        nama_poli,
      },
      include: {
        dokter: {
          select: {
            id_dokter: true,
            nama_lengkap: true,
            spesialis: { select: { nama_spesialis: true } },
          },
        },
      },
    });
    res.json(normalizeSchedule(schedule));
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate jadwal' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jadwal_praktek.delete({ where: { id_jadwal: Number(id) } });
    res.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus jadwal' });
  }
};
