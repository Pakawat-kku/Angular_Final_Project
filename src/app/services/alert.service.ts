import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}

  error(text = 'เกิดข้อผิดพลาด', title = 'เกิดข้อผิดพลาด') {
    return Swal.fire({
      title: title,
      text: text,
      type: 'error',
      confirmButtonText: 'ปิด'
    });
  }

  success(text = 'สำเร็จ', title = 'congrate') {
    return Swal.fire({
      type: 'success',
      title: 'บันทึกข้อมูลเรียบร้อย',
      showConfirmButton: false,
      timer: 1500
    });
  }

  notFoundUser(text = 'not found user', title = ':-(') {
    return Swal.fire('Not found user!');
  }

  confirm(title = 'คุณต้องลบรายการนี้ใช่ไหม ?') {
    return Swal.fire({
      title: 'ยกเลิกรายการนี้',
      text: 'คุณแน่ใจหรือไม่ ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ยืนยัน'
    });
  }

  newyear() {
    return Swal.fire({
      title: 'ขึ้นปีงบประมาณใหม่',
      text: 'คุณแน่ใจหรือไม่ ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ยืนยัน'
    });
  }

  delete() {
    return Swal.fire({
      title: 'ลบรายชื่อนี้',
      text: 'คุณแน่ใจหรือไม่ ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ยืนยัน'
    });
  }
  restore() {
    return Swal.fire({
      title: 'คืนสถานะการลา',
      text: 'คุณแน่ใจหรือไม่ ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'yes'
    });
  }

approve() {
  return Swal.fire({
    title: 'ยืนยันการอนุมัติ',
    text: 'คุณแน่ใจหรือไม่ ?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'yes'
  });
}

print() {
  return Swal.fire({
    title: 'Print PDF',
    text: 'คุณแน่ใจหรือไม่ ?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'yes'
  });
}
}
